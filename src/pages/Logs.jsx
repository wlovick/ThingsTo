// import React from "react";
// import { useState, useEffect } from "react";
// import supabase from "../helper/supabaseClient";
// import { useNavigate } from "react-router-dom";
import LogBase from "../components/LogBase";

function Logs() {
  // const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     if (error) throw error;
  //     setUser(data.user);
  //   };
  //   getUser();
  // }, []);

  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) throw error;
  //   navigate("/login");
  // };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: 0, margin: 0 }}>
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingTop: 20 }}>
        {LogBase()}
      </div>
    </div>
  );
}

export default Logs;
