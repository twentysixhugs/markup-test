const slider = document.querySelector('.js-slider-input');
const sliderPercentage = document.querySelector('.js-slider-percentage');

const updateSlider = () => {
  const value = slider.value;
  sliderPercentage.textContent = `${value}%`;
}

slider.addEventListener('input', updateSlider);
updateSlider();


// Кастомная выпадашка, кастомный скроллбар.
// Поскольку проблематично кастомизировать его в не хроме и использовать либу нельзя, написал свой.
(() => {
  const dropdownBtn = document.querySelector('.js-dropdown-btn');
  const dropdownContent = document.querySelector('.js-dropdown-content');
  const dropdownArrowDown = document.querySelector('.js-dropdown-down-arrow');
  const dropdownArrowUp = document.querySelector('.js-dropdown-up-arrow');
  const scrollbarThumb = document.querySelector('.custom-scrollbar__thumb');
  const scrollbarViewport = document.querySelector('.custom-scrollbar__viewport');

  let isDragging = false;

  // Переключение открыть/закрыть
  dropdownBtn.addEventListener('click', () => {
    const isOpen = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isOpen ? 'none' : 'block';
    dropdownArrowDown.style.display = isOpen ? 'block' : 'none';
    dropdownArrowUp.style.display = isOpen ? 'none' : 'block';
    dropdownBtn.classList.toggle('c-form__dropdown-btn--open', !isOpen);
  });

  // Обновление текста кнопки и закрытие выпадашки
  const dropdownItems = document.querySelectorAll('.c-form__dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      dropdownBtn.textContent = e.target.textContent;
      dropdownContent.style.display = 'none';
      dropdownArrowDown.style.display = 'block';
      dropdownArrowUp.style.display = 'none';
      dropdownBtn.classList.remove('c-form__dropdown-btn--open');
      dropdownBtn.setAttribute('data-selected', 'true'); // Отметить как выбранное
    });
  });

  // Функция для обновления позиции ползунка
  const moveThumb = (pageY) => {
    const { top, bottom, height } = scrollbarViewport.getBoundingClientRect();
    const scrollbarHeight = bottom - top;
    const thumbHeight = scrollbarThumb.offsetHeight;
    const maxThumbTop = scrollbarHeight - thumbHeight;
    let thumbTop = pageY - top - (thumbHeight / 2);
    thumbTop = Math.max(0, Math.min(thumbTop, maxThumbTop));
    scrollbarThumb.style.top = `${thumbTop}px`;
    const scrollPercentage = thumbTop / maxThumbTop;
    dropdownContent.scrollTop = scrollPercentage * (dropdownContent.scrollHeight - dropdownContent.offsetHeight);
  };

  // Событие нажатия мыши на ползунке
  scrollbarThumb.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    moveThumb(e.pageY);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Событие перемещения мыши по документу
  const onMouseMove = (e) => {
    if (isDragging) {
      moveThumb(e.pageY);
    }
  };

  // Событие отпускания кнопки мыши на документе
  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  // Событие клика по треку
  const scrollbarTrack = document.querySelector('.custom-scrollbar__track');
  scrollbarTrack.addEventListener('click', (e) => {
    const thumbRect = scrollbarThumb.getBoundingClientRect();
    if (e.pageY < thumbRect.top || e.pageY > thumbRect.bottom) {
      moveThumb(e.pageY);
    }
  });

  // Обновление позиции ползунка при прокрутке содержимого
  dropdownContent.addEventListener('scroll', () => {
    const scrollPercentage = dropdownContent.scrollTop / (dropdownContent.scrollHeight - dropdownContent.offsetHeight);
    const scrollbarHeight = scrollbarViewport.getBoundingClientRect().height;
    const thumbHeight = scrollbarThumb.offsetHeight;
    const maxThumbTop = scrollbarHeight - thumbHeight;
    const thumbTop = scrollPercentage * maxThumbTop;
    scrollbarThumb.style.top = `${thumbTop}px`;
  });

  // Включение прокрутки списка опций выпадашки с помощью колесика мыши
  dropdownContent.addEventListener('wheel', (e) => {
    e.preventDefault();
    dropdownContent.scrollTop += e.deltaY;
  });

  // Обновление лейбла поля ввода файла
  const fileInput = document.querySelector('input[type="file"]');
  const fileInputLabel = document.querySelector('.c-form__label--file-input span');

  fileInput.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'Прикрепить файл';
    fileInputLabel.textContent = fileName;
  });
})()

document.querySelector('.js-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const dropdownBtn = document.querySelector('.js-dropdown-btn');
  const isDropdownSelected = dropdownBtn.getAttribute('data-selected');

  if (!isDropdownSelected) {
    dropdownBtn.focus();
    alert('Пожалуйста, выберите тип системы.');
    // Поскольку это не продакшен проект, а тестовое и либ у меня нет,
    // а я очень устал, написав собственный скроллбар с нуля,
    // я просто покажу alert
    return;
  }

  // Вытаскиваем значения с формы, показываем alert с ними при отправке

  const dropdownValue = dropdownBtn.textContent.trim();

  const emailValue = document.querySelector('input[name="email"]').value;
  const nameValue = document.querySelector('input[name="name"]').value;

  const sliderValue = document.querySelector('.js-slider-input').value;
  const sliderPercentage = `${sliderValue}%`;

  const fileInputPlaceholder = "прикрепить файл";

  const fileInput = document.querySelector('input[type="file"]');
  const fileName = fileInput.files[0] ? fileInput.files[0].name : fileInputPlaceholder.toUpperCase();

  alert(`Dropdown: ${dropdownValue}\nEmail: ${emailValue}\nName: ${nameValue}\nSlider: ${sliderPercentage}\nFile: ${fileName}`);
});
