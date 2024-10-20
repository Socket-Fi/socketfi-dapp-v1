import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism-tomorrow.css"; // or any other theme you prefer

const CodeBlock = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <div className="bg-[#282B34] border-2  rounded-md p-3 ">
      <pre className="h-96 lg:h-[550px] ">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
