"use client";

import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import Records from "@/_Components/TestPaper/Records";

export default function RecordsPage(){
    return(
        <main className="container-fluid">
        <div className="row ">
          <Aside_Faculty/>
          <div className="custom-m col-11 col-md-10 p-0">
            <Records/>
          </div>
        </div>
      </main>
    )
}