import React from 'react';
import config from '../../config';
import { updateAllListings } from '../../util/adminApi';
import { sendAdminEmail } from '../../util/api';

const StyleguidePage = props => {
  return config.dev ? (
    <section>
      <div>NAV</div>
      <div>
        <h2>Actions:</h2>
        <div>
          Reset all listings:
          <button onClick={() => updateAllListings()}>RESET</button>
        </div>
        <div>
          Send Admin Email
          <button
            onClick={() =>
              sendAdminEmail({
                message: {
                  subject: 'NEW RENTAL AGREEMENT REQUESTED',
                  body:
                    'A new rental agreement has been requested. Please generate the appropriate document and contact both parties to have it signed.',
                },
                content: {
                  ongoingContract: null,
                  lengthOfContract: 8,
                  groundRules: ['noPets', 'noGuests', 'noSmoking'],
                  intendedUse: 'Creative Storage Eventfdsafsda',
                  startDate: '2022-02-05T02:00:00.000Z',
                  endDate: '2022-04-02T02:00:00.000Z',
                },
                renterId: '61f07dde-eb83-4845-9ec9-cafd318634fe',
                hostId: '619b6429-fe44-4732-924e-7a5bc9bb8868',
              })
            }
          >
            SEND TEST EMAIL
          </button>
        </div>
      </div>
    </section>
  ) : null;
};

StyleguidePage.defaultProps = {};

StyleguidePage.propTypes = {};

export default StyleguidePage;
