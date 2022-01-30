import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionFeaturesMaybe = props => {
  const { options, publicData, listingType } = props;
  console.log("🚀 | file: SectionFeaturesMaybe.js | line 9 | props", props);
  if (!publicData) {
    return null;
  }
  console.log("🚀 | file: SectionFeaturesMaybe.js | line 23 | options", options);

  const selectedOptions = publicData && publicData.amenities ? publicData.amenities : [];
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id={`ListingPage.${listingType}FeaturesTitle`} />
      </h2>
      <PropertyGroup
        id="ListingPage.amenities"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionFeaturesMaybe;
