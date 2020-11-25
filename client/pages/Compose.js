/**Same For Reply.js
 * Set the local state of email components
 * posdt email
 *
 */
import { useState } from "react";
import store from "../store";
import { useRouter } from "next/router";
import CustomButton from "./components/CustomButton";
import PageTitle from "./components/PageTitle";
import InputTextBox from "./components/InputTextBox";
import BodySplitter from "./components/BodySplitter";
import Layout from "./components/Layout";
import axios from "axios";
import Tippy from "@tippy.js/react";
import defaults from "../utils/defaults";

export default function () {
  const router = useRouter(); // Routes inside functions.
  const [checked, setChecked] = useState([]);

  function handleSendClick() {
    const storeState = store.getState();
    const jwt = localStorage.getItem("token");

    const payload = {
      subject: `${storeState.subText}`,
      body: `${storeState.greeting}\n${storeState.message}\n${storeState.closing}`,
      from: undefined, // use account's default identity according to the JWT
      to: [{ email: `${storeState.toText}` }],
      cc: [],
      bcc: [],
    };

    axios
      .post(`${defaults.serverUrl}/email`, payload, {
        headers: {
          "x-auth-token": jwt,
        },
      })
      .then((res) => {
        router.push("/Inbox");
      })
      .catch((err) => {});
  }

  function handleRouteClick(route) {
    router.push(route);
  }

  function handleBackClick() {
    router.back();
  }

  function handleHelp(helpType) {
    switch (helpType) {
      case "cc":
        return "This is a CC";
    }
  }

  function handleCheckClick(event, label) {
    const copyChecked = [...checked];
    if (event.target.checked) {
      if (!copyChecked.includes(label)) copyChecked.push(label);
    } else {
      const index = copyChecked.indexOf(label);
      if (index >= 0) copyChecked.splice(index, 1);
    }
    setChecked(copyChecked);
  }

  let errMsg = "";
  if (!checked.includes("to")) {
    errMsg = "Remember to check the to box!";
  } else if (!checked.includes("cc")) {
    errMsg = "Remember to check the cc box!";
  } else if (!checked.includes("subject")) {
    errMsg = "Remember to check the subject box!";
  } else if (!checked.includes("body")) {
    errMsg = "Remember to check the body box!";
  }

  return (
    <Layout>
      <div>
        <PageTitle title={`COMPOSING MESSAGE`} />{" "}
        {/* is user_id the from._id */}
      </div>
      <div>
        <InputTextBox label="To" rows="1" />
        <div>
          {!checked.includes("to") ?
          (<span><input 
            type="checkbox" 
            className= "checkBox" 
            style={{width: 20, height: 20}}
            onChange={(e) => handleCheckClick(e, "to")} 
            checked={checked.includes("to")} 
          />
          <label><strong>Are you sending this email to the right person?</strong></label></span>) : null}
        </div>
        <InputTextBox 
            label="CC" 
            rows="1"  
        />
        {!checked.includes("cc") ?
        (<span><input 
          type="checkbox" 
          className= "checkBox" 
          style={{width: 20, height: 20}}
          onChange={(e) => handleCheckClick(e, "cc")} 
          checked={checked.includes("cc")} 
        />
        <label><strong>Do you want to send this email to another person or other people?</strong></label></span>) : null}
        <InputTextBox
          label="Subject"
          rows="1"
        />
        <div>
          {!checked.includes("subject") ? 
            (<span><input 
            type="checkbox" 
            className= "checkBox" 
            style={{width: 20, height: 20}}
            onChange={(e) => handleCheckClick(e, "subject")} 
            checked={checked.includes("subject")} 
          />
          <label><strong>Is your subject descriptive and interesting?</strong></label></span>) : null}
        </div>
        <BodySplitter />
        <div>
          {!checked.includes("body") ? 
          (<span><input 
            type="checkbox" 
            className= "checkBox" 
            style={{width: 20, height: 20}}
            onChange={(e) => handleCheckClick(e, "body")} 
            checked={checked.includes("body")} 
          />
          <label><strong>Have you said everything you wanted to say?</strong></label></span>) : null}
        </div>
      </div>
      <div>
        <br />
        <span>
          <p>{errMsg.length == 0 ? " " : errMsg}</p>
          <div className="buttons">
            <CustomButton
              label="Send"
              onClick={handleSendClick}
              type="button"
              disabled={checked.length < 4}
            />
            <CustomButton
              label="Back"
              onClick={() => handleBackClick()}
              type="button"
              disabled={false}
            />
            <CustomButton
              label="Help"
              onClick={() => handleRouteClick("/Help")}
              type="button"
              disabled={false}
            />
          </div>
        </span>
      </div>
    </Layout>
  );
}
