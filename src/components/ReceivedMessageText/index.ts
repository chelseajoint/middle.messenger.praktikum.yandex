import { Block } from '../../utils/Block';

const receivedMessageTpl = `
    <h5 class="received-message">
      {{{receivedMessage}}}
    </h5>
    <h7 class="message-time received-message-time">
      {{{receivedMessageDate}}}
    </h7>
`;

interface ReceivedMessageProps{
  receivedMessage: string;
  receivedMessageDate: string;
}

export class ReceivedMessage extends Block {
  constructor(props: ReceivedMessageProps) {
    super('div', props);
  }

  _init() {
    this.element!.classList.add('received-message-text-box');
  }

  render(): string {
    return this.compile(receivedMessageTpl, this.props);
  }
}