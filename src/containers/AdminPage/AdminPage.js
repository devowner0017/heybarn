import React from 'react';
import config from '../../config';
import {updateAllListings} from '../../util/adminApi'

const StyleguidePage = props => {
  return config.dev ? (
    <section>
      <div>NAV</div>
      <div>
        <h2>Actions:</h2>
        <div>
          Reset all listings:
          <button onClick={_ => updateAllListings()}>RESET</button>
        </div>
      </div>
    </section>
  ) : null;
};

StyleguidePage.defaultProps = {  };

StyleguidePage.propTypes = {
};

export default StyleguidePage;
