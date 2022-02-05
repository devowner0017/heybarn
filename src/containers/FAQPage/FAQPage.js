import React, { useState } from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';
import { Grow, Collapse } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import css from './FAQPage.module.css';
import image from './about-us-1056.jpg';

const FAQPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const [sectionOpen, setSectionOpen] = useState('') // prettier-ignore
  const [subSectionOpen, setSubSectionOpen] = useState('') // prettier-ignore
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  console.log('🚀 | file: FAQPage.js | line 40 | FAQPage | sectionOpen', sectionOpen);
  const handleSection = section => {
    setSubSectionOpen('');
    if (section === sectionOpen) setSectionOpen('general');
    else setSectionOpen(section);
  };
  const handleSubSection = section => {
    if (subSectionOpen.includes(section))
      setSubSectionOpen(subSectionOpen.filter(s => s !== section));
    else {
      setSubSectionOpen([...subSectionOpen, section]);
      console.log('🚀 | file: FAQPage.js | line 34 | FAQPage | section', section);
      var element = document.getElementById(section);
      console.log('🚀 | file: FAQPage.js | line 35 | FAQPage | element', element);
      element?.scrollIntoView({ behavior: 'smooth', alignToTop: true });
    }
  };
  const northIsland = [
    { region: 'Auckland', price: 79 },
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
      <Table  size="small"aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#c35827'}}>
            <TableCell sx={{color: '#fff', fontWeight: 800 }} >Region</TableCell>
            <TableCell sx={{color: '#fff', fontWeight: 800 }}  align="center">$ per week per bay of space</TableCell>
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
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <img className={css.coverImage} src={image} alt="My first ice cream." />
          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <h2 className={css.pageTitle} onClick={() => handleSection('general')}>
                General heybarn FAQ
              </h2>
              <h2 className={css.pageTitle} onClick={() => handleSection('host')}>
                Being a heybarn host
              </h2>
              <h2 className={css.pageTitle} onClick={() => handleSection('renter')}>
                Being a heybarn renter
              </h2>
            </div>
            <div className={css.contentMain}>
              <Collapse id={'general'} in={sectionOpen === 'general'}>
                <h3>How do I become a heybarn account holder?</h3>
                <p>
                  Easy! Select Sign up on the heybarn homepage and follow the instructions. Becoming
                  a heybarn member is completely free and carries no obligation.
                </p>
                <h3>I've forgotten my password - How can I reset it? </h3>

                <p>
                  To reset your password, select Login on the heybarn homepage and follow the
                  prompts to easily update your password using your nominated email address.
                </p>
                <h3>Where in New Zealand is heybarn available?</h3>
                <p>
                  In early 2022, heybarn was launched in the Manawatu-Wanganui region and the lower
                  South Island. Heybarn will shortly expand throughout New Zealand. If you live
                  outside of the Manawatu-Wanganui region or lower South Island, please register
                  your interest and we will let you know when heybarn will be available in your
                  region.
                </p>
                <h3>Is heybarn available in Australia?</h3>
                <p>
                  Not yet! Heybarn has been launched in New Zealand, with plans to expand into
                  Australia soon. If you live in Australia and are interested in heybarn, please
                  register your interest and we will let you know when heybarn will be available in
                  your area.
                </p>
                <h3>How can I be COVID-safe through heybarn?</h3>
                <p>
                  On the heybarn site, you can complete almost all steps involved in identifying,
                  vetting and communicating with a host online. When you arrange a viewing of a
                  space, please follow all current mandatory requirements to minimize the spread of
                  COVID 19, such as wearing effective masks and maintaining social distancing. If
                  you choose to create a Rental Agreement through heybarn, approval is via an online
                  digital signature and all payments can seamlessly be funnelled via heybarn,
                  minimizing further physical contact with the host.{' '}
                </p>

                <h3>How do I leave feedback for heybarn?</h3>
                <p>
                  We are constantly working to improve the heybarn experience and would appreciate
                  your feedback. Select Contact at the bottom of the heybarn site and complete the
                  contact form. We will respond to any enquiry promptly. Heybarn will also
                  periodically seek customer feedback via email.{' '}
                </p>

                <h3>Who can I contact at heybarn if I need help?</h3>
                <p>
                  If you need to contact heybarn, you can either call on 0800 439 2276 or email
                  support@heybarn.co.nz.
                </p>
              </Collapse>
              <Collapse id={'host'} in={sectionOpen === 'host'}>
                <h3>How does heybarn work for hosts?</h3>
                <p>
                  Heybarn has you covered from start to finish -- from listing your space on a
                  quality site to secure management of ongoing rental payments direct to your
                  account.{' '}
                </p>
                <p>
                  You can list your available shed space for free. If you want to attract multiple
                  renters, list each available space separately. You can either wait for an
                  interested renter to get in contact or you can pay a fee to hold an advert that
                  you believe may suit your space. If there's a mutual connection, you can arrange a
                  viewing of your space. Once the rental terms have been agreed, you can then create
                  a personalised Rental Agreement specific to your needs using heybarn. Once the
                  agreement is signed, heybarn can securely manage payments from the renter,
                  including first and last week rent, for a small (3%) commission.
                </p>
                <h3>What do I need to be a Heybarn host?</h3>
                <p>
                  To become a heybarn host, you will need a shed or building or space within a shed
                  or building that you are not using and a heybarn account. Be aware,
                  accommodation/rooms for rent cannot be advertised on heybarn.
                </p>
                <h3>What kind of space can I list on heybarn?</h3>
                <p>
                  Kiwis need space of all sizes and types, from open-sided sheds to fully enclosed,
                  commercial-quality shedding. Just make sure that you are honest about the quality
                  of your space in your listing and take lots of quality photos.
                </p>
                <h3>I've got space in town - can I still list it on heybarn?</h3>
                <p>
                  Although heybarn focuses on advertising available shed or building space on
                  lifestyle and rural properties in New Zealand, feel free to list any available
                  space you own in peri-urban or urban areas. Be aware, accommodation/rooms for rent
                  cannot be advertised on heybarn.
                </p>
                <h3>Can I rent my space out to more than one renter at a time?</h3>
                <p>
                  A single shed, for example, can be rented out to more than one renter at the same
                  time. However, each area (e.g., each bay within a multi-bay shed) must be listed
                  separately on the heybarn site and you must create a separate Rental Agreement for
                  each individual renter.
                </p>
                <h2
                  className={css.pageSubTitle}
                  onClick={() => handleSubSection('hostCreateListing')}
                >
                  Creating a listing
                </h2>
                <Collapse
                  id={'hostCreateListing'}
                  in={subSectionOpen.includes('hostCreateListing')}
                >
                  <h3>How long does it take to create a listing?</h3>
                  <p>
                    No time at all! Simply select List your space in the top right of the heybarn
                    site and you will be guided through entering all the information you need to
                    develop a quality listing for your shed. Photos will form a key part of your
                    listing and taking the photos before you start writing your listing is
                    recommended to save time. Any incomplete listings will be saved in your heybarn
                    account.
                  </p>
                  <h3>How can I create a fantastic listing?</h3>
                  <p>
                    After selecting List your space in the top right of the heybarn site, follow the
                    steps to develop a great quality listing. Take your time to describe your
                    listing accurately and with plenty of detail. Good quality photographs that show
                    both the inside and outside of the space, including the route(s) of access, will
                    also make all the difference. Potential renters will also want to know about you
                    so head over to your Profile page to update your profile bio and photo.
                  </p>
                  <h3>How much should I rent my space for?</h3>
                  <p>
                    As at early 2022, the average weekly cost of a bay of commercial self-storage
                    space (approximate size of a single garage) was estimated at:
                    <br />
                    {table}
                    <br />
                    Multiply the above amounts by the number of bays you have available (e.g., 3-
                    bay shed in Hamilton area = $184/week). As a rule, heybarn suggests you charge
                    50% to 75% of this amount, considering the quality of your shed.
                  </p>
                  <h3>What if I only want to rent out my space for a short period of time?</h3>
                  <p>
                    During the listing process, you will be asked to list the date when your space
                    will become available and when availability will end. If you wish to list a
                    space for a short space of time, use an end date that minimises the availability
                    to renters.
                  </p>
                  <h3>What if my space becomes unavailable for a limited period?</h3>
                  <p>
                    If you have an existing published listing that you wish to amend, use the edit
                    listing function and re-set the end date. If you need to remove the listing,
                    select delete. This listing will be retained in your accounts so that you can
                    relist it again in the future.
                  </p>
                </Collapse>
                <h2
                  className={css.pageSubTitle}
                  onClick={() => handleSubSection('hostCancelListing')}
                >
                  Cancelling a listing
                </h2>
                <Collapse
                  id={'hostCancelListing'}
                  in={subSectionOpen.includes('hostCancelListing')}
                >
                  <h3>How do I cancel a listing?</h3>
                  <p>
                    You can delete, hide or edit your listing at any point while listed, simply open
                    the advert from your account and select your preferred option. If you meet with
                    a potential renter and decide to proceed using the heybarn rental agreement and
                    rental payment service, the listing is automatically removed. If both parties
                    opt to continue without the heybarn services, renters will have to select an
                    appropriate option to avoid continued attention from other potential hosts.
                  </p>
                  <h3>How do I cancel a signed Rental Agreement?</h3>
                  <p>
                    According to the standard heybarn Rental Agreement, a renter may terminate an
                    Agreement prior to or from the Rental Start Date, by giving not less than 28
                    days' notice in writing to the host. Access the listing on the heybarn site via
                    your Inbox and select Cancel agreement. Rental payments will cease from that
                    date.
                  </p>
                  <h3>
                    I'm not happy with the Rental Arrangement I've made with a renter - What should
                    I do?
                  </h3>
                  <p>
                    Firstly, always make sure you confirm rental terms with the renter before
                    creating a Rental Agreement. If you would like to change these terms before
                    final sign-off, contact support@heybarn.co.nz and we can help. If you wish to
                    edit the terms after an Agreement has been signed, contact support@heybarn.co.nz
                    and we can walk you through creating a new Rental Agreement. In most cases,
                    keeping some dialogue open with the renter is the best option. According to the
                    standard heybarn Rental Agreement, a host or renter may terminate an Agreement
                    prior to or from the Rental Start Date, by giving not less than 28 days' notice
                    in writing to the host. To cancel a Rental Agreement, access the listing on the
                    heybarn site via your Inbox and select Cancel agreement. Rental payments will
                    cease from that date.
                  </p>
                  <h3>Why has my listing been turned off or deleted?</h3>
                  <p>
                    Heybarn reserves the right to suspend or delete a listing at any time. Reasons
                    for this may be because you listed your contact details in the listing, or the
                    listing contained explicit or inappropriate content. If your listing has been
                    suspended or deleted, heybarn will be in touch to help resolve any concerns so
                    you can get your space back up on the site as soon as possible.
                  </p>
                </Collapse>
                <h2
                  className={css.pageSubTitle}
                  onClick={() => handleSubSection('hostTransactions')}
                >
                  How are transactions managed through heybarn?{' '}
                </h2>
                <Collapse id={'hostTransactions'} in={subSectionOpen.includes('hostTransactions')}>
                  <h3>How do I contact a potential renter?</h3>
                  <p>
                    If you find a potential renter advertising on heybarn, make contact by
                    initiating the heybarn connection (Make Contact button) and pay the holding fee.
                    This will hold (or 'grey out') the renter's advert until they have reviewed your
                    listing. If a renter agrees to connect with you, you can strike up a
                    conversation via a secure chat on the heybarn site and share your details as you
                    wish. You can continue to chat via the site or can swap numbers to talk
                    directly.
                  </p>
                  <h3>What happens if a renter wants to contact me?</h3>
                  <p>
                    If your listing is seen by a potential renter and they initiate a connection by
                    paying the holding fee, your listing will become held (or 'greyed out'). You
                    will receive an email to your nominated email account and a new transaction will
                    appear in your heybarn inbox. Follow the instructions in the email to review the
                    potential renter's advert and either accept or decline their interest.
                  </p>
                  <h3>Does it cost me anything to list my space on heybarn?</h3>
                  <p>No. Listing your available space on heybarn is completely free.</p>
                  <h3>What is the heybarn holding fee?</h3>
                  <p>
                    When you see a renter's advert you like, make contact by clicking the Make
                    Contact button. Heybarn charges a $20 holding fee to hold that advert and let
                    the renter know that you would like to learn more. You can hold more than one
                    advert at a time, although a separate holding fee will be charged for each
                    advert. This fee is instated to encourage only genuine enquiries and minimise
                    'tyre- kickers'.
                    <br />
                    Similarly, if a host seeks to contact you (as a renter), they will need to pay
                    the holding fee which in turn will hold (or 'grey out') your advert until you
                    decide about the suitability of the host's listing.
                  </p>
                  <h3>What is the heybarn service fee?</h3>
                  <p>
                    Heybarn offer a personalised Rental Agreement and secure rental payment service
                    through the heybarn app via{' '}
                    <ExternalLink href="https://www.stripe.com/nz">Stripe</ExternalLink>. Stripe is
                    a global economic infrastructure company that enables secure transactions
                    online. See https://stripe.com/nz for more details. If you elect to take
                    advantage of these services, heybarn charge a 3% service fee to cover
                    administrative costs.
                  </p>
                  <h3>Do I need to pay tax on my rental earnings?</h3>
                  <p>
                    Please discuss with your personal accountant on whether you will need to pay tax
                    on your rental earnings and whether you will need to enrol for Goods and Service
                    Tax (GST).
                  </p>
                  <h3>How can I change my credit card or rental account details?</h3>
                  <p>
                    To change your credit card or rental account details, select View account under
                    your profile photo on the heybarn homepage. Then select My Payment Settings
                    under the My Account page.
                  </p>
                </Collapse>
                <h2 className={css.pageSubTitle} onClick={() => handleSubSection('hostSecure')}>
                  How do I stay secure using heybarn?
                </h2>
                <Collapse id={'hostSecure'} in={subSectionOpen.includes('hostSecure')}>
                  <h3>How do I ensure renting out my space is as safe as possible?</h3>
                  <p>
                    We know the process of renting out your available space may seem daunting.
                    Heybarn has been specifically designed to simplify the process and minimize any
                    risk to you as a host.
                    <br />
                    Your contact details, including the address of your available space, will not be
                    visible on your listing. You will be able to review a renter's advert before
                    that renter can contact you directly. If their advert isn't the right fit for
                    you, you can safely decline the renter's request without disclosing your contact
                    details. You will oversee when and how a potential renter can undertake a
                    viewing of your space, can create a personalised Rental Agreement and also
                    manage rental payments via heybarn, providing the security of a third party
                    dedicated payment service.
                  </p>
                  <h3>
                    How do I stay safe when organising a viewing with a potential host or renter?
                  </h3>
                  <p>
                    When you arrange a viewing with a potential host or renter, heybarn recommends
                    you take sensible precautions. Ensure someone else knows what is planned before
                    you enter a property or invite the renter onto your property. Do not offer or
                    take any money (including a “deposit”) until a Rental Agreement has been signed.
                  </p>
                  <h3>Can I trust heybarn with my credit card details?</h3>
                  <p>
                    Yes. Heybarn is committed to data privacy. We do not store your credit card
                    details, instead, we use the third party Stripe payment processing platform for
                    secure transactions, including storage of your bank account details. Stripe is a
                    global economic infrastructure company that enables secure transactions online.
                    See https://stripe.com/nz for more details.
                  </p>
                  <h3>Can I trust heybarn with my bank account details?</h3>
                  <p>
                    Yes. Heybarn is committed to data privacy. We do not store your bank account
                    details. Instead, we use the third party Stripe payment processing platform for
                    secure transactions, including storage of your bank account details. Stripe is a
                    global economic infrastructure company that enables secure transactions online.
                    See https://stripe.com/nz for more details.
                  </p>
                  <h3>What happens if my space gets damaged by a renter?</h3>
                  <p>
                    Under the terms of the standard heybarn Rental Agreement, the renter must
                    resolve any damage caused to a proper degree of workmanship when the Agreement
                    ends.
                  </p>
                  <h3>Do I need to insure my space?</h3>
                  <p>
                    As a host, it is your responsibility to insure your space. Speak to your
                    existing insurance provider regarding how a renter may wish to use your space
                    before the rental start date (e.g., storage or business activities). Under the
                    standard heybarn Rental Agreement terms, it is agreed that the host will keep
                    the space insured with reputable insurers to cover full rebuilding, site
                    clearance, professional fees, GST (if applicable) and three years' loss of rent.
                    It is also recommended that you consider public liability insurance.
                    <br />
                    Under the standard heybarn Rental Agreement terms, the renter accepts that
                    property belonging to them stored in the space cannot be covered by the host's
                    property insurance under New Zealand insurance law.
                  </p>
                </Collapse>
              </Collapse>

              <Collapse in={sectionOpen === 'renter'}>
                <h3>How does heybarn work for renters?</h3>
                <p>
                  Heybarn has you covered from start to finish -- from a quality site to list your
                  need for space to secure management of ongoing rental payments direct from your
                  account. <br />
                  You can advertise your need for space for free. You can then either wait for an
                  interested host to get in contact or you can pay a fee to hold a listing that you
                  believe may suit your needs. If there's a mutual connection, you can arrange a
                  viewing of the space via heybarn. Once the rental terms have been agreed, you can
                  then create a personalised Rental Agreement specific to your needs using heybarn.
                  Once the Agreement is signed, heybarn can securely manage payments to the host,
                  including first and last week's rent.
                </p>
                <h3>How do I become a heybarn renter?</h3>
                <p>
                  Easy! Select 'Sign up' on the heybarn homepage and follow the instructions.
                  Becoming a heybarn member is completely free and carries no obligation. You will
                  need to understand what you may want to use the space for so you can create an
                  advert on heybarn. You will also have to be over 18 years of age.
                </p>
                <h3>What are some reasons why Kiwis may need more space?</h3>
                <p>
                  Kiwis need more space of all sizes and types for all sorts of reasons. This may
                  range from simply storing items, such as furniture, boats or caravans, to running
                  a small business. Others may like to use the space for creative pursuits, such as
                  an art class, or to hold an event.
                </p>
                <h3>
                  What should I be aware of when renting space on a lifestyle property or rural
                  farm?
                </h3>
                <p>
                  When you rent space via heybarn, you will be developing a connection with a local
                  lifestyle or rural property owner. These hosts will be able to provide a greater
                  variety of available space at locations across New Zealand, closer to where you
                  need it. It is strongly recommended that you arrange an in-person viewing of the
                  space to confirm key elements, such as access, extra terms and host expectations.
                </p>
                <h3>Can I use the listing for accommodation?</h3>
                <p>No. You cannot rent accommodation space via the heybarn site.</p>

                <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCreate')}>
                  Creating an advert
                </h2>
                <Collapse id={'renterCreate'} in={subSectionOpen.includes('renterCreate')}>
                  <h3>How long does it take to create an advert?</h3>
                  <p>
                    No time at all! Simply select Advertise your need in the top right of the
                    heybarn site and you will be guided through entering all the information you
                    need to develop a quality advert to describe why you need some extra space.
                  </p>
                  <h3>Can I save a draft advert and finish it later?</h3>
                  <p>
                    Once you have completed the first step creating an advert and saved the step, a
                    draft of the advert is saved in your account. You edit and publish it later when
                    it suits.
                  </p>
                  <h3>How can I make my advert stand out from the crowd?</h3>
                  <p>
                    After selecting Advertise your need in the top right of the heybarn site, follow
                    the steps to develop a quality advert. Take your time to describe what you need
                    accurately and with plenty of detail. Good quality photographs that will provide
                    the host with an idea of what you're after, will make all the difference (e.g.,
                    if you want to store your boat, one or more images of the boat that provide an
                    idea of its size would be helpful).
                  </p>
                </Collapse>
                <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCancel')}>
                  How do I cancel an advert{' '}
                </h2>
                <Collapse id={'renterCancel'} in={subSectionOpen.includes('renterCancel')}>
                  <h3>How do I cancel an advert?</h3>
                  <p>
                    You can delete, hide or edit your advert at any point while advertising, simply
                    open the advert from your account and select your preferred option. If you meet
                    with a potential host and decide to proceed using the heybarn rental agreement
                    and rental payment service, the advert is automatically removed. If both parties
                    opt to continue without the heybarn services, renters will have to select an
                    appropriate option to avoid continued attention from other potential hosts.
                  </p>
                  <h3>
                    I'm not happy with the arrangement I've made with a host, what should I do?
                  </h3>
                  <p>
                    Make sure you confirm rental terms with the host before creating a Rental
                    Agreement. If you would like to change these terms before final sign-off,
                    contact support@heybarn.co.nz and we can help. If you wish to edit the terms
                    after an Agreement has been signed, contact support@heybarn.co.nz and we can
                    walk you through creating a new Rental Agreement. According to the standard
                    heybarn Rental Agreement, a renter may terminate an Agreement prior to or from
                    the Rental Start Date, by giving not less than 28 days' notice in writing to the
                    host. To cancel a Rental Agreement, access the listing on the heybarn site via
                    your Inbox and select Cancel agreement. Rental payments will cease from that
                    date.
                  </p>
                  <h3>How do I cancel a signed Rental Agreement?</h3>
                  <p>
                    According to the standard heybarn Rental Agreement, you can terminate an
                    Agreement prior to or from the Rental Start Date, by giving not less than 28
                    days' notice in writing to the host. Access the listing on the heybarn site via
                    your Inbox and select Cancel agreement. Rental payments will cease from that
                    date.
                  </p>
                  <h3>Why has my advert been turned off or deleted?</h3>
                  <p>
                    Heybarn reserves the right to suspend or delete an advert at any time. Reasons
                    for this may be because you listed your contact details in the advert, or the
                    advert contained explicit or inappropriate content. If your advert has been
                    suspended or deleted, heybarn will be in touch to help resolve any concerns
                    ASAP.
                  </p>
                </Collapse>
                <h2
                  className={css.pageSubTitle}
                  onClick={() => handleSubSection('renterTransaction')}
                >
                  How are transactions managed through heybarn?
                </h2>
                <Collapse
                  id={'renterTransaction'}
                  in={subSectionOpen.includes('renterTransaction')}
                >
                  <h3>How do I contact a potential host?</h3>
                  <p>
                    Once a host agrees to connect with you or you agree to connect with a host, you
                    can send your first message via a secure chat on the heybarn site. You can
                    continue to chat via the site or can swab numbers to talk directly.
                  </p>
                </Collapse>
                <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterCost')}>
                  How much does it cost to use heybarn?
                </h2>
                <Collapse id={'renterCost'} in={subSectionOpen.includes('renterCost')}>
                  <h3>Does it cost me anything to advertise on heybarn?</h3>
                  <p>No. Advertise your need for space on heybarn completely free.</p>
                  <h3>What is the heybarn holding fee?</h3>
                  <p>
                    When you see a host's listing that you like, Heybarn will charge a $20 Holding
                    fee to allow us to hold that listing for you and let the host know that you
                    would like to speak to them about their space. You can hold more than one
                    listing at a time - a separate Holding fee will be charged for each listing.
                    This fee is instated to encourage only genuine enquiries and minimise
                    'tyre-kickers'. Similarly, if a host seeks to contact you (as a renter), they
                    will need to pay the Holding fee which in turn will hold (or 'grey out') your
                    advert until you have reviewed the host's listing.
                  </p>
                  <h3>What is the heybarn service fee?</h3>
                  <p>
                    Heybarn offer a personalised Rental Agreement and secure rental payment service
                    through the heybarn app via{' '}
                    <ExternalLink href="https://www.stripe.com/nz">Stripe</ExternalLink>. Stripe is
                    a global economic infrastructure company that enables secure transactions
                    online. See https://stripe.com/nz for more details. If you elect to take
                    advantage of these services, heybarn charge a 3% service fee to cover
                    administrative costs.
                  </p>
                  <h3>How can I change my credit card or rental account details?</h3>
                  <p>
                    To change your credit card or rental account details, select View account under
                    your profile photo on the heybarn homepage. Then select My Payment Settings
                    under the My Account page.
                  </p>
                </Collapse>
                <h2 className={css.pageSubTitle} onClick={() => handleSubSection('renterSafety')}>
                  How do I stay secure using heybarn?
                </h2>
                <Collapse id={'renterSafety'} in={subSectionOpen.includes('renterSafety')}>
                  <h3>How do I ensure renting space is as low risk as possible?</h3>
                  <p>
                    We know the process of renting space may seem daunting. Heybarn has been
                    specifically designed to simplify the process and minimize any risk to you as a
                    renter. <br />
                    Your contact details will not be visible on your advert. You will be able to
                    review a host's listing before that host can contact you directly. If the
                    listing isn't the right fit, you can safely decline the host's interest. You
                    will control when and how you will view a space, can create a personalised
                    Rental Agreement via heybarn and can also funnel rental payments via heybarn,
                    providing the security of a third party.
                  </p>
                  <h3>How do I stay safe when viewing a space with a potential host?</h3>
                  <p>
                    When you arrange to view a new space with a potential host, heybarn recommends
                    you take precautions. Take a friend or family member with you and let someone
                    else know when you've arrived on and left the property. Do not give the host any
                    money (including a “deposit”) until a Rental Agreement has been signed.
                  </p>
                  <h3>Can I trust heybarn with my credit card details?</h3>
                  <p>
                    Heybarn uses the third-party Stripe payment processing platform for secure
                    transactions. See https://stripe.com/nz for more details.
                  </p>
                  <h3>Can I trust heybarn with my bank account details?</h3>
                  <p>
                    Heybarn uses the third-party Stripe payment processing platform for secure
                    transactions, including storage of your bank account details. See
                    https://stripe.com/nz for more details.
                  </p>
                  <h3>What happens if I damage a space that I'm renting? </h3>
                  <p>
                    Under the terms of the standard heybarn Rental Agreement, the renter must
                    resolve any damage caused to a proper degree of workmanship when the Agreement
                    ends.
                  </p>
                  <h3>
                    What happens if my belongings get damaged in a space rented through heybarn?
                  </h3>
                  <p>
                    As a renter, it is your responsibility to insure your belongings and/or business
                    when renting space identified through heybarn. Speak to your existing insurance
                    provider regarding how you wish to use the space before the Rental Start Date
                    (e.g., storage or business activities).
                  </p>
                  <h3>Do I need to insure my belongings or business? </h3>
                  <p>
                    As a renter, it is your responsibility to insure your belongings and/or business
                    when renting space identified through heybarn. Speak to your existing insurance
                    provider regarding how you wish to use the space before the Rental Start Date
                    (e.g., storage, business activities). Under the standard heybarn Rental
                    Agreement terms, the renter accepts that property belonging to them stored in
                    the space cannot be covered by the host's property insurance under New Zealand
                    insurance law. Under that Agreement, a host is required to keep their space
                    insured with reputable insurers to cover full rebuilding, site clearance,
                    professional fees, GST (if applicable) and three years' loss of rent.{' '}
                  </p>
                </Collapse>
              </Collapse>
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
