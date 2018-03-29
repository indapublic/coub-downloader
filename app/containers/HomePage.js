import React, { Component } from "react";
import * as child_process from "child_process";

function makeid(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: "",
      output: "",
      output_file: "",
      no_sound: false,
      is_submitting: false,
      loop: 0
    };
  }

  componentDidMount() {
    this.setState({
      output: `/tmp/${makeid(16)}.mp4`
    });
  }

  render() {
    const {
      source,
      output,
      output_file,
      no_sound,
      is_submitting,
      loop,
      err,
      stdout,
      stderr
    } = this.state;
    return (
      <div>
        <p>
          <label>
            Ссылка
            <input
              name="input"
              type="text"
              value={source}
              onChange={ev => {
                this.setState({
                  source: ev.target.value
                });
              }}
            />
          </label>
        </p>
        <p>
          <label>
            Повторять
            <input
              type="number"
              value={loop}
              onChange={ev => {
                if (ev.target.value >= 0) {
                  this.setState({
                    loop: ev.target.value
                  });
                }
              }}
            />
            раз
          </label>
        </p>
        <p>
          <label>
            Без звука<input
              type="checkbox"
              checked={no_sound}
              onChange={ev => {
                this.setState({
                  no_sound: !no_sound
                });
              }}
            />
          </label>
        </p>
        <p>
          <button onClick={this.generate}>
            {is_submitting ? "Подождите..." : "Создать"}
          </button>
        </p>
        {!!err && <div>{err}</div>}
        {!!stdout && <div>{stdout}</div>}
        {!!stderr && <div>{stderr}</div>}
        {!!output_file && (
          <a href={output_file} download>
            Скачать
          </a>
        )}
      </div>
    );
  }

  getCommand = () => {
    const { source, output, no_sound, loop, err, stdout, stderr } = this.state;
    let res = " coub-dl ";
    if (!!source) {
      res += ` --input ${source}`;
    }
    if (!!output) {
      res += ` --output ${output}`;
    }
    if (!!no_sound) {
      res += ` --no-audio `;
    }
    if (loop > 0) {
      res += ` -loop ${loop} `;
    }
    res = res.trim();
    return res;
  };

  generate = () => {
    this.setState({
      is_submitting: true,
      output_file: null
    });
    const command = this.getCommand();
    child_process.exec(command, (err, stdout, stderr) => {
      this.setState({
        is_submitting: false,
        err,
        stdout,
        stderr,
        output_file: !!err || !!stdout ? null : this.state.output
      });
    });
  };
}
