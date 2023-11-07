import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";


function ListOfTest({ setClicked, clicked }) {
  const { TUPCID } = useTUPCID();
  const [TestName, setTestName] = useState("");
  const [Subject, setSubject] = useState("");
  const [uid, setUid] = useState("");
  const [section, setSection] = useState("");
  const [List, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [sectionSubjectName, setSectionSubjectName] = useState([]);



  const add = async () => {
    const New = {
      TestName: TestName,
      Subject: Subject,
      UidTest: uid,
      SectionName: section,
      UidProf: TUPCID,
    };
    if (TestName != "" && Subject != "" && section != "" && uid != "") {
      setMessage("");
      try {
        const response = await axios.post(
          "http://localhost:3001/TestList",
          New
        );
        if (response.status === 200) {
          fetchingTestList();
        }
      } catch (err) {
        throw err;
      }
      setTestName("");
      setSubject("");
      setSection("");
      setUid("");
    } else {
      setMessage("Required to Fill up");
    }
  };
  const testNameSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.TestName.localeCompare(b.TestName)
    );
    setList(sortedList);
  };
  const subjectSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.Subject.localeCompare(b.Subject)
    );
    setList(sortedList);
  };
  const sectionSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.Section_Name.localeCompare(b.Section_Name)
    );
    setList(sortedList);
  };
  const yearSort = () => {
    const sortedList = [...List].sort(
      (a, b) => new Date(a.date_created) - new Date(b.date_created)
    );
    setList(sortedList);
  };

  const removeTest = async (data) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/TestList?UidTest=${data}`
      );
      if (response.status === 200) {
        alert("remove");
        fetchingTestList();
      }
    } catch (err) {
      console.error("Problem on removing test");
    }
  };

  const fetchingSectionName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/TestListSectionName?UidProf=${TUPCID}`
      );
      setSectionSubjectName(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchingTestList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/TestList?UidProf=${TUPCID}`
      );
      if (response.status === 200) {
        setList(response.data);
      }
    } catch (err) {
      console.error("Fetching failed");
    }
  };
  useEffect(() => {
    fetchingTestList();
    fetchingSectionName();
  }, [TUPCID]);

  const generate = () => {
    const randoms = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var generated = "";
    for (let i = 0; i < 5; i++) {
      const generating = randoms[Math.floor(Math.random() * randoms.length)];
      generated = generated + generating;
    }
    setUid(generated);
  };
  const handleclick = () => {
    setClicked(!clicked);
  };
  return (
    <main className="w-100 min-vh-100">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-start p-2">
        <div className="d-flex gap-2 align-items-center mb-3 justify-content-between w-100">
          <div className="d-flex align-items-center gap-3 w-100">
            <i
              className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
              onClick={handleclick}
            ></i>
            <div className="d-flex align-items-center gap-2 w-100">
              <Link
                href={{ pathname: "/Faculty" }}
                className="d-sm-block d-none"
              >
                <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
              </Link>
              <h2 className="m-0 text-sm-start text-center w-100 pe-3">
                FACULTY
              </h2>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 ">
          <div className="d-flex gap-3">
            <Link
              href={{
                pathname: "/Faculty",
              }}
              className="text-decoration-none link-dark"
            >
              <h4>SECTIONS</h4>
            </Link>
            <h4 className="text-decoration-underline">TESTS</h4>
          </div>
          <div className="align-self-end">
            <small>Sort by:</small>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 position-relative">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark"
              data-bs-toggle="modal"
              data-bs-target="#Addtest"
            >
              + ADD TEST
            </button>
            {/* Start Modal Add Test */}
            <div
              className="modal fade"
              id="Addtest"
              tabIndex="-1"
              aria-labelledby="AddtestLabel"
              aria-hidden="true"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header position-relative justify-content-center">
                    <h1 className="modal-title fs-5" id="AddtestLabel">
                      ADD TEST
                    </h1>
                    <button
                      type="button"
                      className="btn-close m-0 position-absolute end-0 pe-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body px-5">
                    <p className="m-0">TEST NAME</p>
                    <input
                      value={TestName}
                      onChange={(e) => setTestName(e.target.value)}
                      type="text"
                      className="px-3 py-1 rounded border border-dark col-12"
                    />
                    <p className="m-0">SUBJECT</p>
                    <select
                      onChange={(e) => setSubject(e.target.value)}
                      className="px-3 py-1 rounded border border-dark col-12"
                    >
                      <option value="" selected hidden disabled>
                        Choose...
                      </option>
                      {sectionSubjectName.map((subject, index) => (
                        <option value={subject.Subject} key={index}>
                          {subject.Subject}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="#SectionName">Section Name</label>
                    <div className="row col-12 m-0 gap-sm-4 gap-3">
                      <select
                        name="SectionName"
                        id="SectionName"
                        className="py-1 px-3 rounded border border-dark"
                        onChange={(e) => setSection(e.target.value)}
                      >
                        <option value="" selected hidden disabled>
                          Choose...
                        </option>
                        {sectionSubjectName.map((sections, index) => (
                          <option value={sections.Section_Name} key={index}>
                            {sections.Section_Name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="m-0">UID</p>
                    <div className="row m-0 gap-sm-3 gap-2">
                      <input
                        value={uid}
                        type="text"
                        className="px-3 py-1 rounded border border-dark col-7"
                        disabled
                      />
                      <button
                        className="btn btn-outline-dark col-4"
                        onClick={generate}
                      >
                        GENERATE
                      </button>
                    </div>
                  </div>

                  <div className="modal-footer justify-content-center w-100">
                    <small className="text-danger col-12 text-center">
                      {message}
                    </small>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss={
                        message === "Required to Fill up" ? "" : "modal"
                      }
                      onClick={add}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Modal for Add test */}
            <Link href={{ pathname: "/Faculty/Preset" }}>
              <button className="btn btn-outline-dark">PRESETS</button>
            </Link>
          </div>
          <div className="dropdown align-self-center">
            <i
              className="bi bi-arrow-down-up d-md-none d-flex fs-4"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></i>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" onClick={testNameSort}>
                  TESTNAME
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={subjectSort}>
                  SUBJECT
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={yearSort}>
                  YEAR
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={sectionSort}>
                  SECTION / COURSE
                </a>
              </li>
            </ul>
          </div>

          <div className="d-md-flex d-none gap-md-2 gap-1 position-absolute end-0 align-self-end">
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={testNameSort}
            >
              TEST NAME
            </button>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={subjectSort}
            >
              SUBJECT
            </button>
            <button className="btn btn-outline-dark btn-sm" onClick={yearSort}>
              YEAR
            </button>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={sectionSort}
            >
              SECTION / COURSE
            </button>
          </div>
        </div>
        <div className="row m-0 mt-4 col-12 gap-1">
          {List.map((test, index) => (
            <div
              className="px-3 py-2 border border-dark rounded col-12"
              key={index}
            >
              <div className="d-flex justify-content-between">
              <span>
          <Link
            href={{
              pathname: "/Faculty/Test/TestPaper",
              query: {
                testname: test.TestName,
                uid: test.Uid_Test,
                sectionname: test.Section_Name
              }
            }}
          >
            
              {test.TestName} {test.Subject} {test.Section_Name}&nbsp;
              {test.Uid_Test}
            
          </Link>
        </span>
                <div className="btn-group" key={index}>
                  <i className="bi bi-three-dots" data-bs-toggle="dropdown"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={() => removeTest(test.Uid_Test)}
                      >
                        Remove
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default ListOfTest;
