// Handles the process of creating a new domo
const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == ''){
    handleError("RAWR! All feilds are required");
    return false;
  }
  
  sendAjax('POST', $("#domoForm").attr("action"),$("#domoForm").serialize(),function() {
    loadDomosFromServer();
  });
  
  return false;
}

// Function for generating the JSX for the domo submission form
const DomoForm = (props) => {
  return (
    <form id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
  );
}

// Function for generating JSX to display the current user's domos
const DomoList = function(props) {
  if(props.domos.length === 0){
    return (
      <div className="domolist">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name}</h3>
        <h3 className="domoAge"> age: {domo.age}</h3>
      </div>
    );
  });
  
  return (
    <div id="domoList">
      {domoNodes}
    </div>
  );
};

// Ajax request to get a list of Domos from the server
const loadDomosFromServer = () => {
  sendAjax('GET','/getDomos',null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

// Sets up the maker page
const setup = function(csrf) {
  //renders form
  ReactDOM.render(
    <DomoForm csrf={csrf} />,document.querySelector("#makeDomo")
  );
  
  //renders default domo list display
  ReactDOM.render(
    <DomoList domos={[]} />,document.querySelector("#domos")
  );
  
  loadDomosFromServer();
};

$(document).ready(function() {
  getToken();
});