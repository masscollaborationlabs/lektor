import React, { ChangeEvent, Component, createRef, RefObject } from "react";
import { getInputClass, WidgetProps } from "./types";

export class MultiLineTextInputWidget extends Component<WidgetProps> {
  textarea: RefObject<HTMLTextAreaElement>;

  constructor(props: WidgetProps) {
    super(props);
    this.recalculateSize = this.recalculateSize.bind(this);
    this.textarea = createRef();
  }

  onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    this.recalculateSize();
    this.props.onChange(event.target.value);
  }

  componentDidMount() {
    this.recalculateSize();
    window.addEventListener("resize", this.recalculateSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.recalculateSize);
  }

  componentDidUpdate() {
    this.recalculateSize();
  }

  recalculateSize() {
    const node = this.textarea.current;
    if (!node) {
      return;
    }

    const style = window.getComputedStyle(node);
    const diff =
      style.getPropertyValue("box-sizing") === "border-box"
        ? 0
        : parseInt(style.getPropertyValue("padding-bottom") || "0", 10) +
          parseInt(style.getPropertyValue("padding-top") || "0", 10);

    const updateScrollPosition = node === document.activeElement;
    // Cross-browser compatibility for scroll position
    const oldScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const oldHeight = node.offsetHeight;

    node.style.height = "auto";
    const newHeight = node.scrollHeight - diff;
    node.style.height = newHeight + "px";

    if (updateScrollPosition) {
      window.scrollTo(
        document.body.scrollLeft,
        oldScrollTop + (newHeight - oldHeight)
      );
    }
  }

  render() {
    const { type, value, placeholder, disabled } = this.props;

    return (
      <div>
        <textarea
          ref={this.textarea}
          className={getInputClass(type)}
          onChange={this.onChange.bind(this)}
          style={{
            display: "block",
            overflow: "hidden",
            resize: "none",
          }}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    );
  }
}
