module.exports = (content) => {
  const blocks = content
    .split(/\n\s*\n/)        // split by empty lines safely
    .map(b => b.trim())
    .filter(Boolean);        // remove empty blocks

  const questions = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    // Minimum: question + 2 options
    if (lines.length < 3) continue;

    const question = lines[0];
    const options = [];
    let correctIndex = -1;

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      // Remove option prefix like A. / (a) / 1.
      line = line.replace(/^(\(?[a-dA-D0-9]\)?[.)-]?\s*)/, "");

      if (!line) continue;

      if (line.includes("✅")) {
        correctIndex = options.length;
        line = line.replace("✅", "").trim();
      }

      options.push(line);
    }

    // Telegram rules
    if (
      question &&
      options.length >= 2 &&
      correctIndex !== -1 &&
      correctIndex < options.length
    ) {
      questions.push({
        question,
        options,
        correctIndex
      });
    }
  }

  return questions;
};
