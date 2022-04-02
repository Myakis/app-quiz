'use strict';
const main = document.querySelector('.main');
const form = document.querySelector('.form-main');
const selection = document.querySelector('.selecton');
const title = document.querySelector('.main__title');

const getData = () => {
  return fetch('https://question-quiz-2fcd6-default-rtdb.firebaseio.com/db.json').then(response => response.json());
};

const localResult = id => localStorage.getItem(id);
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

    const result = localResult(themes[i].id);
    if (result) {
      const resultBlock = document.createElement('div');
      resultBlock.className = 'selecton__result';
      resultBlock.innerHTML = `
        <span>${result}/${themes[i].list.length}</span>Последний результат
      `;
      li.append(resultBlock);
    }
  }
  return buttons;
};

const showElem = elem => {
  let opacity = 0;
  elem.opacity = opacity;
  elem.style.display = '';
  const animation = () => {
    opacity += 0.05;
    elem.style.opacity = opacity;
    if (opacity < 1) {
      requestAnimationFrame(animation);
    }
  };
  requestAnimationFrame(animation);
};

const hideElem = (elem, callback) => {
  let opacity = getComputedStyle(elem).getPropertyValue('opacity');
  const animation = () => {
    opacity -= 0.05;
    elem.style.opacity = opacity;
    if (opacity > 0) {
      requestAnimationFrame(animation);
    } else {
      elem.style.display = 'none';
      if (callback) callback();
    }
  };
  requestAnimationFrame(animation);
};

//Перемешиваем массив с правильными ответами
const shuffle = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createKeyAnswers = data => {
  const keys = [];
  for (let i = 0; i < data.answers.length; i++) {
    if (data.type === 'radio') {
      keys.push([data.answers[i], !i]);
    } else {
      keys.push([data.answers[i], i < data.correct]);
    }
  }
  return shuffle(keys);
};

const createAnswer = data => {
  const type = data.type;
  const answers = createKeyAnswers(data);
  const labels = answers.map((item, i) => {
    const label = document.createElement('label');
    label.className = 'form-main__label';

    const input = document.createElement('input');
    input.type = type;
    input.name = `answer`;
    input.value = i;

    const fakeInput = document.createElement('div');
    fakeInput.className = `form-main__fake-${type}`;

    const text = document.createTextNode(item[0]);
    label.append(input, fakeInput, text);
    return label;
  });
  const keys = answers.map(answer => answer[1]);
  return {
    labels,
    keys,
  };
};

const showResult = (result, quiz) => {
  const block = document.createElement('div');
  block.className = 'main__box-final final selecton';

  const persent = (result / quiz.list.length) * 100;
  let ratio = 0;
  for (let i = 0; i < quiz.result.length; i++) {
    if (persent >= quiz.result[i][0]) {
      ratio = i;
    }
  }
  block.innerHTML = `
    <h2 class="main__subtitle main__subtitle-final">Ваш результат</h2>
    <div class="final__box">
      <div class="final__result result-${ratio + 1}"><span>${result}/${quiz.list.length} </span></div>
      <p class="final__text">${quiz.result[ratio][1]}!</p>
    </div>
    <b
  `;
  const button = document.createElement('button');
  button.className = 'final__btn final__return btn';
  button.textContent = `К списку вкизов`;
  block.append(button);
  main.append(block);
  button.addEventListener('click', () => {
    hideElem(block);
    initQuiz();
  });
};

const saveResult = (resultm, id) => {
  localStorage.setItem(id, resultm);
};

const renderQuiz = quiz => {
  hideElem(title);
  hideElem(selection);

  const questionBox = document.createElement('div');
  questionBox.className = 'main__box main__box-question selecton';

  const questionWrapp = document.createElement('div');
  questionWrapp.className = `form-main__box`;
  main.append(questionBox);

  let result = 0;
  let questionCount = 0;

  const showQuestion = () => {
    const data = quiz.list[questionCount];
    questionCount++;
    questionBox.innerHTML = '';
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

    const answerData = createAnswer(data);

    questionWrapp.innerHTML = '';
    questionWrapp.append(...answerData.labels);
    form.append(h2, questionWrapp, footerCard);

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = false;

      const answer = [...form.answer].map(input => {
        if (input.checked) ok = true;
        return input.checked ? input.value : false;
      });
      if (ok) {
        const r = answer.every((result, i) => !!result === answerData.keys[i]);
        if (r) {
          result++;
        }
        if (questionCount < quiz.list.length) {
          showQuestion();
        } else {
          hideElem(questionBox);
          showResult(result, quiz);
          saveResult(result, quiz.id);
        }
      } else {
        form.classList.add('form-main-error');
        setTimeout(() => {
          form.classList.remove('form-main-error');
        }, 1000);
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

const initQuiz = async () => {
  showElem(title);
  showElem(selection);
  const data = await getData();
  const buttons = renderTheme(data);
  addClick(buttons, data);
};

initQuiz();
