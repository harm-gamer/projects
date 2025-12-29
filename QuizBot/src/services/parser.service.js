module.exports = (content) => {
  const blocks = content.split("\n\n");
  let questions = [];

  blocks.forEach(block => {
    const lines = block.split("\n");
    const question = lines[0];
    let options = [];
    let correctIndex = -1;

    lines.slice(1).forEach((line, i) => {
      if (line.includes("✅")) {
        correctIndex = i;
        options.push(line.replace("✅", "").slice(3).trim());
      } else {
        options.push(line.slice(3).trim());
      }
    });

    questions.push({ question, options, correctIndex });
  });

  return questions;
};
