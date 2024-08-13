import React from "react";

interface SnackListProps {
  content: string;
}

const SnackList: React.FC<SnackListProps> = ({ content }) => {
  const formattedContent = content.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  const paragraphs = formattedContent.split(/\n\n+/).filter(Boolean); // Split by double newlines

  return (
    <div className="space-y-2 rounded-sm bg-slate-200 p-6">
      <h2 className="text-black font-extrabold text-xl">Generated Summary</h2>
      {paragraphs.map((paragraph, index) => {
        if (paragraph.match(/\d\.\s+/)) {
          const items = paragraph.split(/\d\.\s+/).filter(Boolean);
          return (
            <ul key={index} className="list-disc list-inside pl-4">
              {items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </ul>
          );
        } else {
          return (
            <p
              key={index}
              className="text-black"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          );
        }
      })}
    </div>
  );
};

export default SnackList;
