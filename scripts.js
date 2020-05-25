// state
let allPeople = [];
let tabPeople = null;
let stats = null;
let elems = null;
let userInput = null;
let button = null;
let peopleResult = null;
let countPeople = null;
let leftBoard = null;
let rightBoard = null;
let displayStats = null;

window.addEventListener('load', () => {
  elems = document.querySelector('.autocomplete');
  elems.focus();
  button = document.querySelector('button');
  button.disabled = true;
  // right and left results areas
  tabPeople = document.querySelector('#peopleList');
  stats = document.querySelector('#stats');
  displayStats = document.querySelector('#displayStats');
  // whole result area
  leftBoard = document.querySelector('#esquerda');
  leftBoard.style.display = 'none';
  rightBoard = document.querySelector('#direita');
  rightBoard.style.display = 'none';

  fetchPeople();
});

async function fetchPeople() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allPeople = json.results
    .map((person) => {
      const { name, gender, picture, dob } = person;
      return {
        name: `${name.first} ${name.last}`,
        gender: gender,
        pic: picture.thumbnail,
        age: dob.age,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  startInput();
}

function startInput() {
  elems.addEventListener('input', () => {
    userInput = elems.value.toLowerCase();
    disableButton(userInput);
    clear();
  });
  elems.addEventListener('keyup', () => {
    if (event.keyCode === 13) matchPeople(userInput);
    controlPanels();
  });
  button.addEventListener('click', () => {
    matchPeople(userInput);
    controlPanels();
  });
}

function matchPeople(userInput) {
  leftBoard.style.display = '';
  
  rightBoard.style.display = '';
  var match = allPeople.filter(
    (person) => person.name.toLowerCase().indexOf(userInput) >= 0
  );

  const show = match.map((person) => {
    const { name, age, pic, gender } = person;
    return {
      name: name,
      age: age,
      pic: pic,
      gender: gender,
    };
  });
  peopleResult = show;
  render();
}

function render() {
  renderRight();
  renderLeft();
  countingPeople();
  clear();
}

function renderRight() {
  const div = document.createElement('div');
  peopleResult.forEach((person) => {
    const ul = document.createElement('ul');

    let pic = document.createElement('li');
    pic.innerHTML = `<img src="${person.pic}"/>`;
    let nameAge = document.createElement('li');
    nameAge.innerHTML = `${person.name} ${person.surname}, ${person.age} anos`;

    ul.appendChild(pic);
    ul.appendChild(nameAge);

    div.appendChild(ul);
  });
  tabPeople.appendChild(div);
}

function countingPeople() {
  countPeople = document.querySelector('#countPeople');
  countPeople.innerHTML = `${peopleResult.length} pessoa(s) encontrada(s)`;
}

function renderLeft() {
  displayStats.innerHTML = 'Estatísticas';

  const div = document.createElement('div');
  const ul = document.createElement('ul');

  let totalAges = sumAges();
  let ages = document.createElement('li');
  ages.innerHTML = `<strong>Soma das idades:</strong> ${totalAges}`;

  let gender = countGender();
  let male = document.createElement('li');
  male.innerHTML = `<strong>Sexo masculino:</strong> ${gender.male}`;
  let female = document.createElement('li');
  female.innerHTML = `<strong>Sexo feminino:</strong> ${gender.female}`;

  let avarAgeCalc = new Intl.NumberFormat().format(
    totalAges / peopleResult.length
  );
  let avarAge = document.createElement('li');
  avarAge.innerHTML = `<strong>Média das idades:</strong> ${avarAgeCalc}`;

  // appending

  ul.appendChild(male);
  ul.appendChild(female);
  ul.appendChild(ages);
  ul.appendChild(avarAge);
  div.appendChild(ul);
  stats.appendChild(div);
}

function sumAges() {
  let totalAges = peopleResult.reduce((acc, person) => {
    return acc + person.age;
  }, 0);
  return totalAges;
}

function countGender() {
  let male = peopleResult.filter((person) => {
    return person.gender === 'male';
  });
  let female = peopleResult.filter((person) => {
    return person.gender === 'female';
  });
  return {
    male: male.length,
    female: female.length,
  };
}

// support cleaning functions
function controlPanels() {
  if (peopleResult == '') {
    tabPeople.style.display = 'none';
  } else {
    tabPeople.style.display = '';
  }
}

function disableButton(inputValue) {
  inputValue != '' ? (button.disabled = false) : (button.disabled = true);
}

function clear() {
  if (!userInput) {
    tabPeople.innerHTML = '';
    countPeople.innerHTML = 'Nenhum resultado';
    leftBoard.style.display = 'none';
    rightBoard.style.display = 'none';
    peopleResult = [];
    stats.innerHTML = '';
  }
}
