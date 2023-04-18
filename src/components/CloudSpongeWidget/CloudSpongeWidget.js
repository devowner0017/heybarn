import React, { useEffect } from 'react';

// Simple React Component that manages adding the cloudsponge object to the page
//  and initializing it with the options that were passed through.
// props:
//  * cloudspongeKey (required): your widget key from your CloudSponge account https://app.cloudsponge.com/app
//  * options (optional): any javascript options you wish to pass to configure the cloudpsonge object
//
// For example, you can use the component like so:
// import CloudSpongeWidget from './CloudSpongeWidget'
// // react boilerplate ...
// <CloudSpongeWidget
//     cloudspongeKey="localhost-only"
//     options={{
//         selectionLimit: this.availableNewUserSlots.bind(this),
//         afterSubmitContacts: this.addUsers.bind(this),
//     }}
// >
//     <a className="cloudsponge-launch" data-cloudsponge-source="gmail">
//         Add your Gmail Contacts
//     </a>
//     <a className="cloudsponge-launch">
//         Add From Address Book
//     </a>
// </CloudSpongeWidget>

function CloudSpongeWidget({ cloudspongeKey, options, children }) {
  // adds an async script tag to the page and invokes a callback when the script has loaded
  const addJavascript = (src, id, callback) => {
    if (id && document.getElementById(id)) {
      // the script is already loaded so just invoke the callback and return
      callback && callback();
      return;
    }

    // create and add the script tag
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = 1;
    if (id) {
      scriptTag.id = id;
    }

    // set the script to invoke a callback after it loads
    if (callback) {
      if (scriptTag.readyState) {
        // IE7+
        scriptTag.onreadystatechange = () => {
          if (scriptTag.readyState == 'loaded' || scriptTag.readyState == 'complete') {
            // clear the callback so it only ever executes once
            scriptTag.onreadystatechange = null;
            callback();
          }
        };
      } else {
        scriptTag.onload = () => {
          // Other browsers support the onload attribute \o/
          callback();
        };
      }
    }

    // assign the src attribute
    scriptTag.src = src;
    // add the script to the page
    document.body.appendChild(scriptTag);
  };

  useEffect(() => {
    addJavascript(
      `https://api.cloudsponge.com/widget/${cloudspongeKey}.js`,
      '__cloudsponge_widget_script',
      () => {
        // calling init attaches the cloudsponge.launch action to any cloudsponge-launch links on the page
        //  we need to wait until the script has loaded so we aren't "bandwidthist"
        if (window.cloudsponge) {
          window.cloudsponge.init(options);
        }
      }
    );
  }, [cloudspongeKey, options]);

  // just render the children, if any.
  //  typically the children will include at least one link decorated with
  //  class="cloudsponge-launch" so that the cloudsponge library will attach
  //  to its onClick handler to launch the widget
  return children;
}

export default CloudSpongeWidget;
