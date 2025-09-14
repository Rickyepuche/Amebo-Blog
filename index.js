export function formatContent(content) {
  return content.replace(/(.{73})(?=\S)/g, '$1\n');
}

export function preserveParagraphs(content) {
    return content
    .split(/\n\s*\n/) // split on double newlines
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('');
}
export function formatTopic(topic) {
  return topic.replace(/(.{36})(?=\S)/g, '$1\n');
}

// document.querySelector("#delete-button").style.visibility = "hidden";

// const password = "ediginrichard";

// const form = document.forms["login-form"];
// const username = form.elements["userEmail"].value;
// const userPassword = form.elements["userPassword"].value;

// if (password === userPassword){
//     document.querySelector("#delete-button").style.visibility = "visible";
// }

