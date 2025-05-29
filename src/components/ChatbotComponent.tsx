import React from "react";

const ChatbotComponent = () => {
  return (
   
    <script
    
    dangerouslySetInnerHTML={{
      __html: `
        window.chtlConfig = { chatbotId: "8615718816" };
        (function() {
          var script = document.createElement("script");
          script.async = true;
          script.id = "chtl-script";
          script.type = "text/javascript";
          script.src = "https://chatling.ai/js/embed.js";
          document.head.appendChild(script);
        })();
      `,
    }}
  ></script>
   
  );
};

export default ChatbotComponent;
