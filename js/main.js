'use strict';
const main = document.querySelector('.main');
const form = document.querySelector('.form-main');
const selection = document.querySelector('.selecton');
const title = document.querySelector('.main__title');
const getData = () => {
  const dataBase = [
    {
      id: '01',
      theme: 'Тема 01',
      result: [
        [40, 'Есть задатки, нужно развиваться'],
        [80, 'Очень хорошо, но есть пробелы'],
        [100, 'ОТличный результат'],
      ],
      list: [
        {
          type: 'checkbox',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
          current: 2,
        },
        {
          type: 'radio',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
          current: 2,
        },
        {
          type: 'radio',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
          current: 2,
        },
        {
          type: 'radio',
          question: 'Вопрос',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
      ],
    },
    {
      id: '02',
      theme: 'Тема 02',
      result: [
        [40, 'Есть задатки, нужно развиваться'],
        [80, 'Очень хорошо, но есть пробелы'],
        [100, 'ОТличный результат'],
      ],
      list: [
        {
          type: 'radio',
          question: 'Вопрос1',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос2',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
          current: 2,
        },
        {
          type: 'radio',
          question: 'Вопрос3',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос4',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
          current: 2,
        },
        {
          type: 'radio',
          question: 'Вопрос5',
          answers: ['Правильный', 'приавильный2', 'неправильный', 'неправильный2'],
        },
      ],
    },
  ];
  return dataBase;
};

const renderTheme = themes => {
  const list = document.querySelector('.selection__box');
  const buttons = [];
  list.textContent = '';
  for (let i = 0; i < themes.length; i++) {
    const li = document.createElement('li');
    li.className = 'selection__item';
    li.textContent = themes[i].theme;
    li.dataset.id = themes[i].id;
    list.append(li);
    buttons.push(li);
  }
  return buttons;
};

const hideElem = elem => {
  let opacity = getComputedStyle(elem).getPropertyValue('opacity');
  const animation = () => {
    opacity -= 0.05;
    elem.style.opacity = opacity;
    if (opacity > 0) {
      requestAnimationFrame(animation);
    } else {
      elem.style.display = 'none';
    }
  };
  requestAnimationFrame(animation);
};

const createAnswer = data => {
  const type = data.type;
  return data.answers.map(item => {
    const label = document.createElement('label');
    label.className = 'form-main__label';
    const input = document.createElement('input');
    input.type = type;
    input.name = `answer`;
    const fakeInput = document.createElement('div');
    fakeInput.className = `form-main__fake-${type}`;
    const text = document.createTextNode(item);
    label.append(input, fakeInput, text);
    return label;
  });
};

const renderQuiz = quiz => {
  hideElem(title);
  hideElem(selection);

  const questionBox = document.createElement('div');
  questionBox.className = 'main__box main__box-question selecton';
  const questionWrapp = document.createElement('div');
  questionWrapp.className = `form-main__box`;
  main.append(questionBox);
  let questionCount = 0;
  const showQuestion = () => {
    const data = quiz.list[questionCount];
    questionCount++;
    questionBox.textContent = '';

    const form = document.createElement('form');
    form.className = 'main__form form-main';

    const h2 = document.createElement('h2');
    h2.className = 'main__subtitle';
    h2.textContent = data.question;

    const wrapp = document.createElement('div');
    wrapp.className = 'form-main__box"';
    questionBox.append(form);

    const footerCard = document.createElement('div');
    footerCard.className = 'form-main__footer';

    const footerBtn = document.createElement('button');
    footerBtn.className = 'form-main__btn btn';
    footerBtn.type = `submit`;
    footerBtn.textContent = `Подтвердить`;

    const footerStep = document.createElement('div');
    footerStep.className = 'form-main__step';
    footerStep.dataset.count = `${questionCount}/${quiz.list.length}`;
    footerCard.append(footerBtn, footerStep);

    const answer = createAnswer(data);
    questionWrapp.append(...answer);
    form.append(h2, questionWrapp, footerCard);
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = false;
      const answer = [...form.answer].map(input => {
        if (input.checked) ok = true;
        return input.checked ? input.value : false;
      });
      if (ok) {
        console.log(answer);
      } else {
        console.error('Не выбран ни один ответ');
      }
    });
  };
  showQuestion();
};
const addClick = (bnts, data) => {
  bnts.forEach(btn => {
    btn.addEventListener('click', () => {
      const quiz = data.find(el => btn.dataset.id === el.id);
      renderQuiz(quiz);
    });
  });
};

const initQuiz = () => {
  const data = getData();
  const buttons = renderTheme(data);
  addClick(buttons, data);
};
initQuiz();
// form.addEventListener('submit', e => {
//   e.preventDefault();
// });
