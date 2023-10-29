import { createWorker } from "tesseract.js";
// const img2 = "https://tesseract.projectnaptha.com/img/eng_bw.png";

export const doOcr = async (img) => {
  if (!img) {
    console.log("未检测到需要识别的图片");
    return;
  }
  const worker = createWorker({
    langPath: "/src/utils/lang-data",
    logger: (m) => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(img);
  console.log(text);
  await worker.terminate();
  return text;
};
