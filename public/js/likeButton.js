let likes = document.querySelectorAll(".like");
let liked = true;
likes.forEach(like => like.addEventListener("click", () => {
   liked = !liked;
   if (!liked) {
      like.classList.add("fas")
      like.classList.remove("far")
   } else {
      like.classList.remove("fas")
      like.classList.add("far")
   }
}))