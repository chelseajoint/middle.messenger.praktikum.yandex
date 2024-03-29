import './style.scss';
import {Block} from "../../../utils/Block";
import {Back} from "../../../components/Back";
import {Button} from "../../../components/Button";
import {LabelInput} from "../../../components/LabelInput";
import {withStore} from "../../../utils/Store";
import {profileController} from "../../../controllers/ProfileController";
import {router} from "../../../utils/Router";
import {User} from "../../../utils/Types";

const changePasswordTpl = `
    {{{buttonBack}}}
    <main class="profile-box">
      <div class="avatar"></div>
      <h3 class="chat-name">Иван</h3>
      <form action="/profile">
        {{{oldPassword}}}
        <hr class="separatory-line">
        {{{newPassword}}}
        <hr class="separatory-line">
        {{{repeatPassword}}}
        {{{formButton}}}
      </form>
    </main>`;

export class ChangePassword extends Block{
    constructor(props: any) {
        super('div', props);
    }

    _init() {
        this.element!.classList.add('ChangePassword');
        this.children.buttonBack = new Back({});
        this.children.oldPassword = new LabelInput({
            ...this.props,
            name: 'oldPassword',
            labelInputClassName: 'profileInput',
            type: 'password',
            labelTitle: 'Old password',
            bottomError: 'bottomErrorProfile',
        });
        this.children.newPassword = new LabelInput({
            ...this.props,
            name: 'newPassword',
            labelInputClassName: 'profileInput',
            type: 'password',
            labelTitle: 'New password',
            bottomError: 'bottomErrorProfile',
        });
        this.children.repeatPassword = new LabelInput({
            ...this.props,
            name: 'repeatNewPassword',
            labelInputClassName: 'profileInput',
            type: 'password',
            labelTitle: 'Repeat new password',
            bottomError: 'bottomErrorProfile',
        });
        this.children.formButton = new Button({
            buttonTitle: 'Save',
            buttonClassName: 'button',
            buttonType: 'button',
            events: {
                click: (event) => this.changePassword(event),
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

    changePassword(event: Event) {
        event.preventDefault()
        const oldPasswordValue = this.getValue('#oldPassword');
        const newPasswordValue = this.getValue('#newPassword');
        const repeatPasswordValue = this.getValue('#repeatNewPassword');
        const data = { oldPassword: oldPasswordValue, newPassword: newPasswordValue }
        if (this.sanitizeInput(oldPasswordValue) && this.sanitizeInput(newPasswordValue) && this.sanitizeInput(repeatPasswordValue)){
            if (newPasswordValue === repeatPasswordValue){
                if (oldPasswordValue !== newPasswordValue) {
                    profileController.changePassword(data)
                    router.go('/settings')
                }
            }
        }
    }

    componentDidUpdate(_oldProps: User, newProps: User): any {
        if (newProps){
            this.props = newProps;
        }
    }

    render() {
        return this.compile(changePasswordTpl, this.props);
    }
}

const withUser = withStore((state) => ({ ...state.user }));

export const ChangePasswordPage = withUser(ChangePassword);
