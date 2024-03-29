import './style.scss'
import {Block} from "../../utils/Block";
import {Button} from "../../components/Button";
import {Input} from "../../components/Input";
import {PopUp} from "../../components/PopUp";
import {store} from "../../utils/Store";
import {router} from "../../utils/Router";
import {chatsController} from "../../controllers/ChatController";
import {chatsList} from "../../components/CorrespondenceList";
import {chatHistory} from "../../components/ChatHistory";
import {messagesController} from "../../controllers/MessageController";

const mainTpl = `
    {{{addChat}}}
    {{{addId}}}
    {{{deleteId}}}
    <div class="chats">
      <div class="chats--content">
        {{{profileButton}}}
        {{{search}}}
        <hr class="separatory-line">
        {{{chatList}}}
        {{{addChatButton}}}
      </div>
    </div>
    <div class="chat-box displayNone">
        <div class="chat-info">
            <div class="chat-avatar"></div>
                <div class="buttons">
                    {{{addButton}}}
                    {{{deleteButton}}}
                </div>
            <hr class="separatory-line">
        </div>
        <div class="chat-history">
          {{{chatHistory}}}
        </div>
        <div class="send-message-box">
           <hr class="separatory-line">
           {{{attachButton}}}
           <form action="send" class="send-message">
                <div class="message">
                    {{{inputSendMessage}}}
                </div>
                {{{sendButton}}}
           </form>
        </div>
    </div>
`;

export class Main extends Block {
    constructor() {
        super('main' );
    }

    _init() {
        chatsController.fetchChats()
          .then(() => {
              Object.keys(store.getState().chats).map((chat) => {
                  messagesController.connect(store.getState().chats[chat].id, store.getState().chats[chat].token)
                    .then(() => {
                        console.log(`chat ${store.getState().chats[chat].id} on`);
                    });
              });
          });

        this.children.chatList = new chatsList();
        this.children.chatHistory = new chatHistory();

        this.children.addChat = new PopUp({
            ...this.props,
            classBox: 'addChat',
            name: 'chatName',
            type: 'text',
            className: 'chatName',
            labelInputClassName: 'labelInputPopUp',
            labelTitle: 'Chat name',
            buttonTitle: 'Add',
            buttonClassName: 'button',
            buttonClassNameSpecial: 'popUpButton',
            buttonType: 'submit',
        });
        this.children.addId = new PopUp({
            ...this.props,
            classBox: 'addId',
            name: 'addId',
            type: 'text',
            className: 'addId',
            labelInputClassName: 'labelInputPopUp',
            labelTitle: 'User ID',
            buttonTitle: 'Add',
            buttonClassName: 'button',
            buttonClassNameSpecial: 'popUpButton',
            buttonType: 'submit',
        });
        this.children.deleteId = new PopUp({
            ...this.props,
            classBox: 'deleteId',
            name: 'deleteId',
            type: 'text',
            className: 'deleteId',
            labelInputClassName: 'labelInputPopUp',
            labelTitle: 'User ID',
            buttonTitle: 'Delete',
            buttonClassName: 'button',
            buttonClassNameSpecial: 'popUpButton',
            buttonType: 'submit',
        });

        this.children.profileButton = new Button({
            buttonTitle: 'Profile >',
            buttonClassName: 'link',
            buttonClassNameSpecial: 'link-profile',
            events: {
                click: () => {
                    router.go('/settings')
                }
            },
        });
        this.children.search = new Input({
            ...this.props,
            name: 'search',
            type: 'search',
            placeholder: 'Search',
            className: 'search',
        });
        this.children.addChatButton = new Button({
            buttonTitle: 'Add chat',
            buttonClassName: 'button',
            events: {
                click: (e) => {
                    this.popUp(e,'.addChat');
                }
            },
        });

        this.children.addButton = new Button({
            buttonTitle: 'Add user',
            buttonClassName: 'button',
            events: {
                click: (e) => {
                    this.popUp(e,'.addId');
                }
            },
        });
        this.children.deleteButton = new Button({
            buttonTitle: 'Delete user',
            buttonClassName: 'button',
            events: {
                click: (e) => {
                    this.popUp(e,'.deleteId');
                }
            },
        });

        this.children.attachButton = new Button({
            buttonClassName: 'attach',
            events: {
                click: () => {
                    console.log('attach');
                }
            },
        });
        this.children.inputSendMessage = new Input({
            ...this.props,
            type: 'message',
            name: 'message',
            placeholder: 'Message',
        });
        this.children.sendButton = new Button({
            buttonClassName: 'send',
            buttonType: 'submit',
            events: {
                click: (e) => this.send(e)
            },
        });
    }

    sanitizeInput(input: any) {
        const scriptRegex = /<\s*[sS][^>]*>/;
        const linkRegex = /<a\b[^>]*>/gi;

        if (scriptRegex.test(input) || linkRegex.test(input)) {
            return false;
        } else {
            return true;
        }
    }

    getValue(selector: any) {
        return document.querySelector(selector).value;
    }

    send(event: Event){
        event.preventDefault();
        const message = this.getValue('#message');
        if (this.sanitizeInput(message) && message != ''){
            messagesController.sendMessage(store.getState().selectedChat, message);
        }
        // eslint-disable-next-line
        let input: HTMLInputElement | null= document.querySelector('#message');
        if (input !== null){
            input.value = '';
        }
    }

    popUp(event: Event, selector: any){
        event.preventDefault();
        const popUp = document.querySelector(selector);
        popUp.classList.remove('displayNone');
        popUp.classList.add('boxBackground');
    }

    render() {
        return this.compile(mainTpl, this.props);
    }
}
