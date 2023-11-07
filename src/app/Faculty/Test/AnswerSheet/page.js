"use client";

import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import AnswerSheet from "@/_Components/TestPaper/AnswerSheet";

export default function AnswerSheetPage() {
  return (
    <div className="d-flex">
        <Aside_Faculty />
        <div className="custom-m col-11 col-md-10 p-0">
          <AnswerSheet />
        </div>
        
      </div>

  );
}
