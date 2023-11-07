"use client";

import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import AnswerKey from "@/_Components/TestPaper/AnswerKey";

export default function AnswerSheetPage(){
    return(
      <div className="d-flex">
            <Aside_Faculty/>
          <div className="custom-m col-11 col-md-10 p-0">
            <AnswerKey/>
          </div>
        </div>
      
    )
}