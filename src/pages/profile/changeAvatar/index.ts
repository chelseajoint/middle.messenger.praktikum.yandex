import './style.scss';
import { Block } from '../../../utils/Block';
import {Input} from "../../../components/Input";
import {Label} from "../../../components/Label";
import {Button} from "../../../components/Button";
import {profileController} from "../../../controllers/ProfileController";

const changeAvatarTpl = `
  <div class="changeAvatarBox">
    <h3 class="changeAvatarText">Загрузите файл</h3>
    <div class="changeAvatarLabelInput">
      {{{label}}}
      {{{input}}}
    </div>
    {{{button}}}
  </div>
`;

export class ChangeAvatar extends Block {
  constructor(props) {
    super('div', props);
  }

  _init() {
    this.element!.classList.add('changeAvatarBoxBackground', 'displayNone');
    this.children.label = new Label({
      name: 'changeAvatar',
      labelTitle: 'Выбрать файл',
    });
    this.children.input = new Input({
      type: 'file',
      name: 'changeAvatar',
      className: 'changeAvatar',
    });
    this.children.button = new Button({
      buttonTitle: 'Загрузить',
      buttonClassName: 'button',
      buttonClassNameSpecial: 'changeAvatarButton',
      buttonType: 'button',
      events: {
        click: (e) => this.changeAvatar(e),
      }
    });
  }

  changeAvatar(event: Event) {
    event.preventDefault()
    const input = document.querySelector('.changeAvatar') as HTMLInputElement;
    const file = input.files[0];
    if (file !== undefined) {
      const formData = new FormData();
      formData.append('avatar', file, file.name);
      profileController.changeAvatar(formData);
    }
    const changeAvatarBox = document.querySelectorAll('.changeAvatarBoxBackground');
    changeAvatarBox[0].classList.add('displayNone');
  }

  render(): string {
    return this.compile(changeAvatarTpl, this.props);
  }
}