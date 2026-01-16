import React from "react";
import Header from "./homepage_components/header";
import Banner from "./homepage_components/banner/banner";
import Carousel from "./homepage_components/carousel/carousel";
import Pricing from "./homepage_components/pricing/pricing";
import Testimonials from "./homepage_components/testimonials/testimonials";
import Achievement from "./homepage_components/achievement/achievement";
import Team from "./homepage_components/team/team";
import Footer from "./homepage_components/footer/footer";
import EventsSection from "./homepage_components/events/event";

export default function Homepage() {
  return (
  <div>
    <Banner  />
    <Carousel />
    <Pricing />
    <Testimonials />
    <Achievement />
    <EventsSection />
    <Team />
  </div>
);
}