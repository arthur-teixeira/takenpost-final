    let commentBtns = Array.from(document.querySelectorAll(".comment-button"));
    let commentInputs = Array.from(document.querySelectorAll(".comment-box"));

    commentBtns.forEach(btn => {
        btn.addEventListener("click", () =>{
            console.log(btn)
            commentInputs[commentBtns.indexOf(btn)].focus();
        })
    });