const $ = document.querySelector.bind(document);
const inputImg = $("#avatar");
const previewImg = $(".preview");

inputImg.addEventListener("change", e => {
   let file = e.target.files.item(0);
   const reader = new FileReader();
   previewImg.classList.add("img-thumbnail")
   reader.onload = e => previewImg.src = e.target.result
   reader.readAsDataURL(file)
})
