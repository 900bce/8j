/** For screenshot preview */
const imageInputFields = document.querySelectorAll('.img-input');
const imagePreviewFields = document.querySelectorAll('.img-preview')

const readURL = (input, index) => {
  const reader = new FileReader();
  if (input.files && input.files[0]) {
    reader.onload = e => {
      // e.target.result 为图像资料
      imagePreviewFields[index].setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

imageInputFields.forEach((input, index) => {
  input.addEventListener('change', e => {
    readURL(e.target, index)
  })
})


/** Report Submit */
const formSubmitBtn = document.querySelector('.submit-btn');
const popup = document.querySelector('.pop-up');
const popupHeading = document.querySelector('.pop-up-heading');
const popupContent = document.querySelector('.pop-up-content');

formSubmitBtn.addEventListener('click', e => {
  e.preventDefault();
  submitReport();
})

showModal = ({ title, content }) => {
  popupHeading.textContent = title;
  popupContent.innerHTML = content;
  popup.style.display = 'block';
}


const checkInput = () => {
  let isAllFilled = true;
  document.querySelectorAll('.input-field').forEach(inputField => {
    showEmptyHint(inputField);
    if (inputField.value === '') {
      isAllFilled = false
    }
  })

  return isAllFilled;
}

const showEmptyHint = (inputField) => {
  if (inputField.value !== '') {
    inputField.classList.remove('empty-hint-border');
    inputField.parentNode.querySelector('.hint').style.display = 'none';
    return;
  }
  inputField.classList.add('empty-hint-border');
  inputField.parentNode.querySelector('.hint').style.display = 'block';
}


const submitReport = () => {
  let times = +localStorage.times || 0;
  const targetDateString = localStorage.targetDate || moment().utc().format();
  const targetDate = moment(targetDateString).utc().utcOffset(480);
  const currentDate = moment().utc().utcOffset(480);

  if (!checkInput()) {
    return;
  }

  if (times >= 2 && targetDate.date() === currentDate.date()) {
    showModal({ title: '本日提交次数已用完', content: '感谢您对8戒棋牌的支持，<br/>您的意见是我们进步的动力！' });
    return;
  }

  showModal({ title: '我们已收到您的反馈', content: '感谢您对8戒棋牌的支持，<br>您的意见是我们进步的动力！' });
  localStorage.setItem('times', ++times > 2 ? 1 : times);
  localStorage.setItem('targetDate', currentDate.utc().format());
}


const clearFields = () => {
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  })
  document.querySelectorAll('.img-preview').forEach(img => {
    img.setAttribute('src', './img/upload-screenshot.png');
  })
  document.querySelector('.opinion-input-field').value = '';
}

/** For Close Modal */
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    popup.style.display = 'none';
    clearFields();
  })
})

document.querySelectorAll('.input-field').forEach(inputField => {
  inputField.addEventListener('blur', e => showEmptyHint(e.target))
});