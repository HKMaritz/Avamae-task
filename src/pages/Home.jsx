import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import HeroSlider from "../components/HeroSlider";
import Navbar from "../components/Navbar";
import OfficeImg from "../assets/Img_004.jpg"; 
import Img002 from "../assets/Img_002.jpg"; // close up with hand for grey overlay

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO , SLIDER */}
      <HeroSlider />

      {/* Section 2 Text left  Image right */}
      <section className="section container twoCol">
        <div className="col text">
          <h2>Justo petentium te vix, scripta regione urbanitas</h2>
          <p>
            Populo facilisi nam no, dolor deleniti deseruisse ne cum, nam quodsi aliquam eligendi ne.
            Ferri euismod accusata te nec, summo accumsan at vix. Ad vix legere impetus, nam
            consequat reformidans ut. No sit consul integre voluptatibus, omnium lucilius ne mel. Et
            ancillae recteque deterruisset sed, ea nec odio option, ferri assum eum et.
          </p>
          <ul className="bullets">
            <li>Te pri efficiendi assueverit, id molestie suavitate per</li>
            <li>Te nam dolorem rationibus repudiandae, ne ius falli aliquip consetetur</li>
            <li>Ut qui dicant copiosae interpretaris</li>
            <li>Ut indoctum patrioque voluptaria duo, ut vis semper abhorreant</li>
          </ul>
          <Link to="/about-us" className="btn btn-primary">Learn more</Link>
        </div>
        <div className="col media">
          <figure className="cardImg">
            <img src={OfficeImg} alt="Modern, colorful office interior" />
          </figure>
        </div>
      </section>

      {/* Grey Photo Overlay CTA */}
      <section className="overlayCta" aria-labelledby="ctaHeading">
        {/* background image layer */}
        <div className="overlayCta__bg">
          <img src={Img002} alt="" aria-hidden="true" />
        </div>

        {/* align to grid, vertically center*/}
        <div className="overlayCta__frame container">
          <div className="ctaCard">
            <h3 id="ctaHeading">Nulla sem urna, dictum sed nisi in, viverra rutrum neque</h3>
            <p>
              Cras sit amet dapibus magna. Orci varius natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Donec finibus nulla quis lorem mollis
              lacinia. Fusce ut arcu ligula. Pellentesque augue ex, pellentesque ut maximus
              non, eleifend ut lorem. Vestibulum rutrum malesuada turpis, molestie mattis
              velit maximus ac. Quisque iaculis hendrerit ex et tincidunt. Aenean eu magna ut
              nisi placerat fringilla in sed diam.
            </p>
            <a href="#" className="btn btn-primary">Log in</a>
          </div>
        </div>
      </section>

      {/* Three paragraphs */}
      <section className="section container threeCols">
        <header className="centeredHead">
          <h2>Justo petentium te vix, scripta regione urbanitas</h2>
          <p className="sub">Taria duo ut vis semper abhorreant</p>
        </header>

        <div className="grid3">
          <p>
            Pellentesque ac condimentum felis. Suspendisse vel suscipit dolor, nec laoreet nulla. Nam auctor ultricies
            dapibus. Donec ac interdum dui, quis finibus lectus.
            Cras in ultrices neque. Curabitur eget turpis iaculis
            diam congue sagittis a vel ligula. Mauris ut arcu ex.
            Nullam quis orci ante. Nunc felis massa, posuere non
            gravida in, commodo in arcu. In feugiat magna non
            volutpat faucibus. Nam aliquam justo nec aliquam
            iaculis. Integer laoreet pulvinar elit pulvinar
            fermentum. Morbi vehicula sodales nunc ac varius.
            Proin porttitor porttitor libero vel pharetra.
          </p>
          <p>
            ridiculus mus. Donec finibus nulla quis lorem mollis
            lacinia. Fusce ut arcu ligula. Pellentesque augue ex,
            pellentesque ut maximus non, eleifend ut lorem.
            Vestibulum rutrum malesuada turpis, molestie mattis
            velit maximus ac. Quisque iaculis hendrerit ex et
            tincidunt. Aenean eu magna ut nisi placerat fringilla in
            sed diam. Suspendisse tristique vel dui nec imperdiet.
            Cras mattis ligula quis fermentum suscipit. Proin et
            elementum arcu, sit amet porttitor diam. Curabitur
            euismod, erat vitae tristique volutpat, augue lectus
            dignissim justo, at faucibus orci est a elit.
          </p>
          <p>
            libero. Maecenas quis nisl eget enim porta blandit a nec
            sapien. Mauris porttitor lorem ut egestas euismod.
            Donec molestie tempor nibh, nec venenatis arcu
            ullamcorper sit amet. Nulla facilisi. Proin cursus neque ut
            tortor scelerisque, at iaculis nunc ornare. Pellentesque
            non nunc nulla. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Aenean et sodales diam.
            ullamcorper sit amet. Nulla facilisi. Proin cursus neque ut
            tortor scelerisque, at iaculis nunc ornare. Pellentesque
            non nunc nulla. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Aenean et sodales diam
          </p>
        </div>

        <div className="centerBtn">
          <a href="#" className="btn btn-primary">Contact us</a>
        </div>
      </section>
    </>
  );
}
