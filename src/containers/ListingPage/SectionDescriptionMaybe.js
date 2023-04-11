import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;

const SectionDescriptionMaybe = props => {
  const { description, listingType, id } = props;
  return description ? (
    <div className={css.sectionDescription}>
      <h2 className={css.descriptionTitle}>
        <FormattedMessage id={`ListingPage.${listingType}DescriptionTitle`} />
      </h2>
      <p className={css.description}>
        {/* {richText(description, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })} */}
        Owned by <span>Hayden M</span>
      </p>
      <p className={css.money}>NZ $30.00/wk</p>
    </div>
  ) : null;
};

export default SectionDescriptionMaybe;
