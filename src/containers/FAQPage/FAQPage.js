import React, { useState } from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage } from '..';
import { TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { Collapse } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import css from './FAQPage.module.css';
import classNames from 'classnames';

import arrowActived from './arrowActive.png';
import arrowInactivated from './arrowInactive.png';

const FAQPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const [sectionOpen, setSectionOpen] = useState('general') // prettier-ignore
  const [subSectionOpen, setSubSectionOpen] = useState('') // prettier-ignore
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);
  const [isActive, setIsActive] = useState(false);

  const handleSection = section => {
    setSubSectionOpen('');
    if (section === sectionOpen) return null;
    else setSectionOpen(section);
  };
  const handleSubSection = section => {
    setIsActive(current => !current);
    if (subSectionOpen.includes(section)) {
      setSubSectionOpen(subSectionOpen.filter(s => s !== section));
    } else {
      setSubSectionOpen([...subSectionOpen, section]);
      var element = document.getElementById(section);
      element?.scrollIntoView({ behavior: 'smooth', alignToTop: true });
    }
  };

  const northIsland = [
    { region: 'Auckland', price: 79 },
    { region: 'Hamilton', price: 62 },
    { region: 'Manawatu-Wanganui', price: 54 },
    { region: 'Taranaki', price: 38 },
    { region: 'Taupo', price: 42 },
    { region: 'Tauranga', price: 55 },
    { region: 'Waikato', price: 66 },
    { region: 'Wellington', price: 60 },
  ];
  const southIsland = [
    { region: 'Canterbury', price: 60 },
    { region: 'Otago', price: 45 },
  ];
  const table = (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#c35827' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }}>Region</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
              $ per week per bay of space
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={'NORTH_ISLAND'}>
            <TableCell component="th" scope="row" colSpan={2} sx={{ fontWeight: 800 }}>
              NORTH ISLAND
            </TableCell>
          </TableRow>
          {northIsland.map(r => {
            return (
              <TableRow key={r.region}>
                <TableCell component="th" scope="row">
                  {r.region}
                </TableCell>
                <TableCell align="center">${r.price}</TableCell>
              </TableRow>
            );
          })}
          <TableRow key={'BREAK'}></TableRow>
          <TableRow key={'SOUTH_ISLAND'}>
            <TableCell component="th" scope="row" colSpan={2} sx={{ fontWeight: 800 }}>
              SOUTH ISLAND
            </TableCell>
          </TableRow>
          {southIsland.map(r => {
            return (
              <TableRow key={r.region}>
                <TableCell component="th" scope="row">
                  {r.region}
                </TableCell>
                <TableCell align="center">${r.price}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'FAQPage',
        description: 'About Heybarn',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer currentPage="FAQPage" />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain>
          <div className={css.coverImage}>
            <h1>We might have the answer here...</h1>
          </div>
          <div className={css.staticPageWrapper}>
            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>
                  Can't find what you are after?<br></br>
                  <a href="/contact-us">Contact us.</a>
                </p>
                <div>
                  <span className={css.__symbol}>
                    {sectionOpen === 'general' ? (
                      <img src={arrowActived} />
                    ) : (
                      <img src={arrowInactivated} />
                    )}
                  </span>
                  <h2
                    className={classNames(css.pageTitle, {
                      [css.active]: sectionOpen === 'general',
                    })}
                    onClick={() => handleSection('general')}
                  >
                    General heybarn FAQ
                  </h2>
                </div>
                <div>
                  <span className={css.__symbol}>
                    {sectionOpen === 'host' ? (
                      <img src={arrowActived} />
                    ) : (
                      <img src={arrowInactivated} />
                    )}
                  </span>
                  <h2
                    className={classNames(css.pageTitle, { [css.active]: sectionOpen === 'host' })}
                    onClick={() => handleSection('host')}
                  >
                    Being a heybarn space owner
                  </h2>
                </div>
                <div>
                  <span className={css.__symbol}>
                    {sectionOpen === 'renter' ? (
                      <img src={arrowActived} />
                    ) : (
                      <img src={arrowInactivated} />
                    )}
                  </span>
                  <h2
                    className={classNames(css.pageTitle, {
                      [css.active]: sectionOpen === 'renter',
                    })}
                    onClick={() => handleSection('renter')}
                  >
                    Being a heybarn renter
                  </h2>
                </div>
              </div>
              <div className={css.contentMain}>
                <Collapse id={'general'} in={sectionOpen === 'general'}>
                  {/* <CardHeader
                    className={css.accordion}
                    onClick={() => handleSubSection('generalBecome')}
                    title="How do I become a heybarn account holder?"
                    action={
                      <IconButton
                        onClick={() => handleSubSection('generalBecome')}
                        aria-label="expand"
                        size="small"
                      >
                        {subSectionOpen.includes('generalBecome') ? <KeyboardArrowUpIcon />
                          : <KeyboardArrowDownIcon />}
                      </IconButton>
                    }
                  ></CardHeader> */}
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalBecome')}>
                    How do I become a heybarn account holder?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalBecome') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalBecome')}>
                    {/* <CardContent> */}
                    <p className={css.panel}>
                      Easy! Select Sign up on the heybarn homepage and follow the instructions.
                      Becoming a heybarn member is completely free and carries no obligation.
                    </p>
                    {/* </CardContent> */}
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalForget')}>
                    I've forgotten my password - How can I reset it?{' '}
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalForget') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalForget')}>
                    <p className={css.panel}>
                      To reset your password, select Login on the heybarn homepage and follow the
                      prompts to easily update your password using your nominated email address.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3
                    className={css.accordion}
                    onClick={() => handleSubSection('generalAvailable')}
                  >
                    Where in New Zealand is heybarn available?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalAvailable') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalAvailable')}>
                    <p className={css.panel}>Heybarn is available throughout New Zealand.</p>
                  </Collapse>
                  <hr></hr>
                  <h3
                    className={css.accordion}
                    onClick={() => handleSubSection('generalAvailableIn')}
                  >
                    Is heybarn available in Australia?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalAvailableIn') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalAvailableIn')}>
                    <p className={css.panel}>
                      Not yet! Heybarn has been launched in New Zealand, with plans to expand into
                      Australia soon. If you live in Australia and are interested in heybarn, please
                      register your interest at support@heybarn.co.nz and we will let you know when
                      heybarn will be available in your area.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalSafe')}>
                    How can I be COVID-safe through heybarn?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalSafe') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalSafe')}>
                    <p className={css.panel}>
                      On the heybarn site, you can complete almost all steps involved in
                      identifying, vetting and communicating with a Space Owner online. When you
                      arrange a viewing of a space, please follow any current mandatory requirements
                      to minimize the spread of COVID 19, such as wearing effective masks and
                      maintaining social distancing.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalLeave')}>
                    How do I leave feedback for heybarn?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalLeave') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalLeave')}>
                    <p className={css.panel}>
                      We are constantly working to improve the heybarn experience and would
                      appreciate your feedback. Select Contact at the bottom of the heybarn site and
                      complete the contact form. We will respond to any enquiry promptly. Heybarn
                      will also periodically seek customer feedback via email.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalContact')}>
                    Who can I contact at heybarn if I need help?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalContact') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalContact')}>
                    <p className={css.panel}>
                      If you need to contact heybarn, you can either call on 0800 439 2276 or email
                      support@heybarn.co.nz.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('generalConnect')}>
                    How does the heybarn Connection fee work?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('generalConnect') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('generalConnect')}>
                    <p className={css.panel}>
                      To contact either a Space Owner or renter on heybarn, you have to pay a
                      one-off $20 non-refundable Connection fee. If that Space Owner or renter do
                      not reply to that contact within five (5) business/working days (including
                      public holidays), you can use the heybarn Connection Guarantee to contact
                      another renter or Space Owner at no charge. Please note that you must use the
                      Connection Guarantee (i.e. contact another user) within thirty (30) calendar
                      days. This time limit re-starts every time you don’t receive contact within
                      the five day working day period. If you want to contact multiple renters or
                      Space Owners within a five-day period, a one-off Connection fee must be paid
                      for each contact. Payment of one Connection fee will invoke the Connection
                      Guarantee rule for attempted contact with only one other user within each
                      five-day period, with "contact" defined as a reply to the communication
                      message from heybarn. This reply may be that the renter or Space Owner does
                      not want to communicate further (i.e. a denial). The contact does not have to
                      be positive or an agreement to proceed further.
                    </p>
                  </Collapse>
                  <hr></hr>
                </Collapse>
                <Collapse id={'host'} in={sectionOpen === 'host'}>
                  <h3 className={css.accordion} onClick={() => handleSubSection('hostWork')}>
                    How does heybarn work for Space Owners?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('hostWork') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('hostWork')}>
                    <p className={css.panel}>
                      You can list your available space for free, being a shed, a garage, a paddock
                      or any other type of space. If you want to attract multiple renters, you can
                      list each available space separately. You can either wait for an interested
                      renter to get in contact or you can pay the Connection fee to hold a Renter
                      Request that you believe may suit your space. If there's a mutual connection,
                      we recommend you arrange a viewing of your space. Once the rental terms have
                      been agreed, we also recommend you use a formal Rental Agreement with these
                      terms and the rental amount clearly spelled out.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('hostNeed')}>
                    What do I need to be a Heybarn Space Owner?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('hostNeed') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('hostNeed')}>
                    <p className={css.panel}>
                      To become a heybarn Space Owner, you will need a shed or building or space
                      within a shed or building or a paddock or similar that you are not using and a
                      heybarn account. Be aware, accommodation/rooms for rent cannot be listed on
                      heybarn.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('hostList')}>
                    What kind of space can I list on heybarn?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('hostList') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('hostList')}>
                    <p className={css.panel}>
                      Kiwis need space of all sizes and types, from open-sided sheds to paddocks to
                      garages to fully enclosed, commercial-quality shedding. Just make sure that
                      you are honest about the quality of your space in your listing and take lots
                      of quality photos.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('hostHave')}>
                    I've got space in town - can I still list it on heybarn?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('hostHave') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('hostHave')}>
                    <p className={css.panel}>
                      Although heybarn focuses on listing available shed, building or paddock space
                      on lifestyle and rural properties in New Zealand, feel free to list any
                      available space you own in peri-urban or urban areas. Be aware,
                      accommodation/rooms for rent cannot be listed on heybarn.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('hostRent')}>
                    Can I rent my space out to more than one renter at a time?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('hostRent') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('hostRent')}>
                    <p className={css.panel}>
                      A single shed, for example, can be rented out to more than one renter at the
                      same time. However, each area (e.g., each bay within a multi-bay shed) must be
                      listed separately on the heybarn site.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h2
                    className={css.pageSubTitle}
                    onClick={() => handleSubSection('hostCreateListing')}
                  >
                    Creating a listing
                  </h2>
                  <Collapse
                    id={'hostCreateListing'}
                    in={!subSectionOpen.includes('hostCreateListing')}
                  >
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostCreateListingCreate')}
                    >
                      How long does it take to create a listing?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostCreateListingCreate') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostCreateListingCreate')}>
                      <p className={css.panel}>
                        No time at all! Simply select Rent your space on the heybarn site homepage
                        and you will be guided through entering all the information you need to
                        develop a quality listing for your space. Photos will form a key part of
                        your listing and taking the photos before you start writing your listing is
                        recommended to save time. Any incomplete listings will be saved in your
                        heybarn account.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostCreateListingfantasy')}
                    >
                      How can I create a fantastic listing?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostCreateListingfantasy') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostCreateListingfantasy')}>
                      <p className={css.panel}>
                        After selecting Rent your space, follow the steps to develop a great quality
                        listing. Take your time to describe your listing accurately and with plenty
                        of detail. Good quality photographs that show both the inside and outside of
                        the space, including the route(s) of access, will also make all the
                        difference. Potential renters will also want to know about you so head over
                        to your Profile page to update your profile bio and photo.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostCreateListingRent')}
                    >
                      How much should I rent my space for?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostCreateListingRent') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostCreateListingRent')}>
                      <p className={css.panel}>
                        When you develop your listing, heybarn will provide you with estimates of
                        recommended minimum and maximum rental amounts considering the size and
                        location of your space. These estimates are calculated based on commercial
                        storage space in your area and we suggest that you charge 50% to 75% of this
                        amount, depending on the quality of your space.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2
                    className={css.pageSubTitle}
                    onClick={() => handleSubSection('hostCancelListing')}
                  >
                    Cancelling a listing
                  </h2>
                  <Collapse
                    id={'hostCancelListing'}
                    in={!subSectionOpen.includes('hostCancelListing')}
                  >
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostCancelListingCancel')}
                    >
                      How do I cancel a listing?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostCancelListingCancel') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostCancelListingCancel')}>
                      <p className={css.panel}>
                        You can delete, hide or edit your listing at any point while listed, simply
                        open the listing from your account and select your preferred option. If you
                        meet with a potential renter and decide to proceed, please remove the
                        listing from the site. You will receive prompts via email to let us know
                        whether your connection was successful and we can remove the listing on your
                        behalf.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostCancelListingTurn')}
                    >
                      Why has my listing been turned off or deleted?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostCancelListingTurn') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostCancelListingTurn')}>
                      <p className={css.panel}>
                        Heybarn reserves the right to suspend or delete a listing at any time.
                        Reasons for this may be because you listed your contact details in the
                        listing, or the listing contained explicit or inappropriate content. If your
                        listing has been suspended or deleted, heybarn will be in touch to help
                        resolve any concerns so you can get your space back up on the site as soon
                        as possible.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2
                    className={css.pageSubTitle}
                    onClick={() => handleSubSection('hostTransactions')}
                  >
                    How are transactions managed through heybarn?{' '}
                  </h2>
                  <Collapse
                    id={'hostTransactions'}
                    in={!subSectionOpen.includes('hostTransactions')}
                  >
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostTransactionsContact')}
                    >
                      How do I contact a potential renter?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostTransactionsContact') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostTransactionsContact')}>
                      <p className={css.panel}>
                        If you find a potential renter on heybarn, make contact by initiating the
                        heybarn connection (Make Contact button) and pay the Connection fee. This
                        will hold (or 'grey out') the renter's Renter Request until they have
                        reviewed your listing. If a renter agrees to connect with you, you can
                        strike up a conversation via a secure chat on the heybarn site and share
                        your details as you wish. You can continue to chat via the site or can swap
                        numbers to talk directly.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostTransactionsWant')}
                    >
                      What happens if a renter wants to contact me?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostTransactionsWant') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostTransactionsWant')}>
                      <p className={css.panel}>
                        If your listing is seen by a potential renter and they initiate a connection
                        by paying the Connection fee, your listing will become held (or 'greyed
                        out'). You will receive an email to your nominated email account and a new
                        transaction will appear in your heybarn inbox. Follow the instructions in
                        the email to review the potential renter's Renter Request and either accept
                        or decline their interest. You will have five (5) business/working days
                        (including public holidays) to indicate whether you’d like to continue to
                        communicate with the renter after reviewing their profile.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostTransactionsCost')}
                    >
                      Does it cost me anything to list my space on heybarn?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostTransactionsCost') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostTransactionsCost')}>
                      <p className={css.panel}>
                        No. Listing your available space on heybarn is completely free.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostTransactionsPay')}
                    >
                      Do I need to pay tax on my rental earnings?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostTransactionsPay') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostTransactionsPay')}>
                      <p className={css.panel}>
                        Please discuss with your personal accountant on whether you will need to pay
                        tax on your rental earnings and whether you will need to enrol for Goods and
                        Service Tax (GST).
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostTransactionsChange')}
                    >
                      How can I change my credit card or rental account details?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostTransactionsChange') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostTransactionsChange')}>
                      <p className={css.panel}>
                        To change your credit card details, select View account under your profile
                        photo on the heybarn homepage. Then select My Payment Settings under the My
                        Account page.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2 className={css.pageSubTitle} onClick={() => handleSubSection('hostSecure')}>
                    How do I stay secure using heybarn?
                  </h2>
                  <Collapse id={'hostSecure'} in={!subSectionOpen.includes('hostSecure')}>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostSecureensure')}
                    >
                      How do I ensure renting out my space is as safe as possible?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostSecureensure') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostSecureensure')}>
                      <p className={css.panel}>
                        We know the process of renting out your available space may seem daunting.
                        Heybarn has been specifically designed to simplify the process and minimize
                        any risk to you as a Space Owner.
                        <br />
                        Your contact details, including the address of your available space, will
                        not be visible on your listing. You will be able to review a renter's
                        profile and Renter Request or direct message before that renter can contact
                        you directly. If their Renter Request isn't the right fit for you, you can
                        safely decline the renter's request without disclosing your contact details.
                        You will also oversee when and how a potential renter can undertake a
                        viewing of your space.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostSecuresafe')}
                    >
                      How do I stay safe when organising a viewing with a potential renter?
                    </h3>
                    <span className={css._symbol}>
                      {!subSectionOpen.includes('hostSecuresafe') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostSecuresafe')}>
                      <p className={css.panel}>
                        When you arrange a viewing with a potential renter, heybarn recommends you
                        take sensible precautions. Ensure someone else knows what is planned before
                        you invite the renter onto your property. We strongly recommended that you
                        do not offer or take any money (including a “deposit”) until a
                        <span id={css.rentalAgree}>Rental Agreement</span> has been signed.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostSecuretrust')}
                    >
                      Can I trust heybarn with my credit card details?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostSecuretrust') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostSecuretrust')}>
                      <p className={css.panel}>
                        Yes. Heybarn is committed to data privacy. We do not store your credit card
                        details, instead, we use the third party Stripe payment processing platform
                        for secure transactions. Stripe is a global economic infrastructure company
                        that enables secure transactions online. See https://stripe.com/nz for more
                        details.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3
                      className={css.accordion}
                      onClick={() => handleSubSection('hostSecureinsure')}
                    >
                      Do I need to insure my space?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('hostSecureinsure') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('hostSecureinsure')}>
                      <p className={css.panel}>
                        As a Space Owner, it is your responsibility to insure your space. Speak to
                        your existing insurance provider regarding how a renter may wish to use your
                        space before the rental start date (e.g., storage or business activities).
                        It is also recommended that you consider public liability insurance.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                </Collapse>

                <Collapse in={sectionOpen === 'renter'}>
                  <h3 className={css.accordion} onClick={() => handleSubSection('Rwork')}>
                    How does heybarn work for renters?
                  </h3>
                  <span className={css.symbol}>{!subSectionOpen.includes('Rwork') ? '-' : '+'}</span>
                  <Collapse in={!subSectionOpen.includes('Rwork')}>
                    <p className={css.panel}>
                      You can list your need for space for free. You can then either wait for an
                      interested Space Owner to get in contact or you can pay a Connection fee to
                      hold a listing that you believe may suit your needs for up to five (5)
                      business days. If there's a mutual connection, you can arrange a viewing of
                      the space via heybarn. Once the rental terms have been agreed, we recommend
                      you use a formal
                      <span id={css.rentalAgree}>Rental Agreement</span> with these terms and the
                      rental amount clearly spelled out.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('Rbecome')}>
                    How do I become a heybarn renter?
                  </h3>
                  <span className={css.symbol}>
                    {!subSectionOpen.includes('Rbecome') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('Rbecome')}>
                    <p className={css.panel}>
                      Easy! Select 'Sign up' on the heybarn homepage and follow the instructions.
                      Becoming a heybarn member is completely free and carries no obligation. You
                      will need to understand what you may want to use the space for so you can
                      create a Renter Request on heybarn. You will also have to be over 18 years of
                      age.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('Rneed')}>
                    What are some reasons why Kiwis may need more space?
                  </h3>
                  <span className={css.symbol}>{!subSectionOpen.includes('Rneed') ? '-' : '+'}</span>
                  <Collapse in={!subSectionOpen.includes('Rneed')}>
                    <p className={css.panel}>
                      Kiwis need more space of all sizes and types for all sorts of reasons. This
                      may range from simply storing items, such as furniture, boats or caravans, to
                      running a small business. Others may like to use the space for creative
                      pursuits, such as an art class, or to hold an event.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('Raware')}>
                    What should I be aware of when renting space on a lifestyle property or rural
                    farm?
                  </h3>
                  <span className={css._symbol}>
                    {!subSectionOpen.includes('Raware') ? '-' : '+'}
                  </span>
                  <Collapse in={!subSectionOpen.includes('Raware')}>
                    <p className={css.panel}>
                      When you rent space via heybarn, you will be developing a connection with a
                      local lifestyle or rural property owner. These Space Owners will be able to
                      provide a greater variety of available space at locations across New Zealand,
                      closer to where you need it. It is strongly recommended that you arrange an
                      in-person viewing of the space to confirm key elements, such as access, extra
                      terms and Space Owner expectations.
                    </p>
                  </Collapse>
                  <hr></hr>
                  <h3 className={css.accordion} onClick={() => handleSubSection('Ruse')}>
                    Can I use the listing for accommodation?
                  </h3>
                  <span className={css.symbol}>{!subSectionOpen.includes('Ruse') ? '-' : '+'}</span>
                  <Collapse in={!subSectionOpen.includes('Ruse')}>
                    <p className={css.panel}>
                      No. You cannot rent accommodation space via the heybarn site.
                    </p>
                  </Collapse>
                  <hr></hr>

                  <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCreate')}>
                    Creating a Renter Request
                  </h2>
                  <Collapse id={'renterCreate'} in={!subSectionOpen.includes('renterCreate')}>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Ccreate')}>
                      How long does it take to create a Renter Request?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Ccreate') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Ccreate')}>
                      <p className={css.panel}>
                        No time at all! Simply select ‘Advertise your need’ on the heybarn homepage
                        and you will be guided through entering all the information you need to
                        develop a quality Renter Request to describe why you need some extra space.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Csave')}>
                      Can I save a draft Renter Request and finish it later?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Csave') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Csave')}>
                      <p className={css.panel}>
                        Once you have completed the first step creating a Renter Request and saved
                        the step, a draft of the Renter Request is saved in your account. You can
                        edit and publish it later when it suits.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Cmake')}>
                      How can I make my Renter Request stand out from the crowd?
                    </h3>
                    <span className={css._symbol}>
                      {!subSectionOpen.includes('Cmake') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Cmake')}>
                      <p className={css.panel}>
                        After selecting ‘Advertise your need’, follow the steps to develop a quality
                        Renter Request. Take your time to describe what you need accurately and with
                        plenty of detail. Good quality photographs that will provide the Space Owner
                        with an idea of what you're after, will make all the difference (e.g., if
                        you want to store your boat, one or more images of the boat that provide an
                        idea of its size would be helpful). If you don’t load photos, your Renter
                        Request will have an icon auto-selected which will represent what you wish
                        to use the space for (e.g., for work).
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCancel')}>
                    How do I cancel a Renter Request{' '}
                  </h2>
                  <Collapse id={'renterCancel'} in={!subSectionOpen.includes('renterCancel')}>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Ccancel')}>
                      How do I cancel a Renter Request?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Ccancel') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Ccancel')}>
                      <p className={css.panel}>
                        You can delete, hide or edit your Renter Request at any point, simply open
                        the Renter Request from your account and select your preferred option.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('CturnOff')}>
                      Why has my Renter Request been turned off or deleted?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('CturnOff') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('CturnOff')}>
                      <p className={css.panel}>
                        Heybarn reserves the right to suspend or delete a Renter Request at any
                        time. Reasons for this may be because you listed your contact details in the
                        Renter Request, or the Renter Request contained explicit or inappropriate
                        content. If your Renter Request has been suspended or deleted, heybarn will
                        be in touch to help resolve any concerns ASAP.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2
                    className={css.pageSubTitle}
                    onClick={() => handleSubSection('renterTransaction')}
                  >
                    How are transactions managed through heybarn?
                  </h2>
                  <Collapse
                    id={'renterTransaction'}
                    in={!subSectionOpen.includes('renterTransaction')}
                  >
                    <h3 className={css.accordion} onClick={() => handleSubSection('Mcontact')}>
                      How do I contact a potential Space Owner?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Mcontact') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Mcontact')}>
                      <p className={css.panel}>
                        Once a Space Owner agrees to connect with you or you agree to connect with a
                        Space Owner, you can message via a secure chat on the heybarn site. You can
                        continue to chat via the site or can swab numbers to talk directly.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCost')}>
                    How much does it cost to use heybarn?
                  </h2>
                  <Collapse id={'renterCost'} in={!subSectionOpen.includes('renterCost')}>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Ccost')}>
                      Does it cost me anything to list on heybarn?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Ccost') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Ccost')}>
                      <p className={css.panel}>
                        No. List your need for space on heybarn completely free.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Cconnect')}>
                      What is the heybarn Connection fee?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Cconnect') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Cconnect')}>
                      <p className={css.panel}>
                        When you see a Space Owner's listing that you like, Heybarn will charge a
                        $20 Connection fee to allow us to hold that listing for you and let the
                        Space Owner know that you would like to speak to them about their space. You
                        can hold more than one listing at a time - a separate Connection fee will be
                        charged for each listing unless you are using an available Connection
                        Guarantee (see above).
                        <br />
                        The Connection fee is instated to encourage only genuine enquiries and
                        minimise 'tyre-kickers'. Similarly, if a Space Owner seeks to contact you
                        (as a renter), they will need to pay the Connection fee which in turn will
                        hold (or 'grey out') your Renter Request until you have reviewed the Space
                        Owner's listing.
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                  <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterSafety')}>
                    How do I stay secure using heybarn?
                  </h2>
                  <Collapse id={'renterSafety'} in={!subSectionOpen.includes('renterSafety')}>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Safety')}>
                      How do I ensure renting space is as low risk as possible?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Safety') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Safety')}>
                      <p className={css.panel}>
                        We know the process of renting space may seem daunting. Heybarn has been
                        specifically designed to simplify the process and minimize any risk to you
                        as a renter. <br />
                        Your contact details will not be visible on your Renter Request or direct
                        message. You will be able to review a Space Owner's listing before that
                        Space Owner can contact you directly. If the listing isn't the right fit,
                        you can safely decline the Space Owner's interest. You will control when and
                        how you will view a space.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Safe')}>
                      How do I stay safe when viewing a space with a potential Space Owner?
                    </h3>
                    <span className={css._symbol}>
                      {!subSectionOpen.includes('Safe') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Safe')}>
                      <p className={css.panel}>
                        When you arrange to view a new space with a potential Space Owner, heybarn
                        recommends you take precautions. Take a friend or family member with you and
                        let someone else know when you've arrived on and left the property. Do not
                        give the Space Owner any money (including a “deposit”) until a
                        <span id={css.rentalAgree}>Rental Agreement</span> has been signed.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Strust')}>
                      Can I trust heybarn with my credit card details?
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Strust') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Strust')}>
                      <p className={css.panel}>
                        Heybarn uses the third-party Stripe payment processing platform for secure
                        transactions. See https://stripe.com/nz for more details.
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Sdamage')}>
                      What happens if my belongings get damaged in a space rented through heybarn?
                    </h3>
                    <span className={css._symbol}>
                      {!subSectionOpen.includes('Sdamage') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Sdamage')}>
                      <p className={css.panel}>
                        As a renter, it is your responsibility to insure your belongings and/or
                        business when renting space identified through heybarn. Speak to your
                        existing insurance provider regarding how you wish to use the space before
                        the Rental Start Date (e.g., storage or business activities).
                      </p>
                    </Collapse>
                    <hr></hr>
                    <h3 className={css.accordion} onClick={() => handleSubSection('Sinsure')}>
                      Do I need to insure my belongings or business?{' '}
                    </h3>
                    <span className={css.symbol}>
                      {!subSectionOpen.includes('Sinsure') ? '-' : '+'}
                    </span>
                    <Collapse in={!subSectionOpen.includes('Sinsure')}>
                      <p className={css.panel}>
                        As a renter, it is your responsibility to insure your belongings and/or
                        business when renting space identified through heybarn. Speak to your
                        existing insurance provider regarding how you wish to use the space before
                        the Rental Start Date (e.g., storage, business activities).
                      </p>
                    </Collapse>
                    <hr></hr>
                  </Collapse>
                </Collapse>
              </div>
            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default FAQPage;
