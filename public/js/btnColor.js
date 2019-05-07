let $ = document.querySelector.bind(document)
let btn = $(".btn-custom")
document.documentElement.style.setProperty(`--maincolor`, `${btn.dataset.color}`)