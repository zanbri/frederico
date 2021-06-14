import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useFetch from "../hooks/useFetch";
import { useAppState, useDispatchAppState } from "./AppContext";

import ProjList from "./ProjList";
import Popover from "./Popover";
import Button from "./Button";

export default function Layout({ children }) {
  const [sortToggle, setSortToggle] = useState(false);

  const router = useRouter();
  const appState = useAppState();
  const dispatch = useDispatchAppState();

  // Sort
  const sortData = (type) => {
    let sorted = [];
    if (type === "year") {
      sorted = [...appState.projs].sort((a, b) => a[type] - b[type]);
    } else if (type === "random") {
      sorted = [...appState.projs].sort(() => 0.5 - Math.random()); // not best method for random shuffle, but good enough
    } else {
      sorted = [...appState.projs].sort((a, b) =>
        a[type].localeCompare(b[type])
      );
    }
    if (sortToggle) {
      sorted.reverse();
    }
    setSortToggle(!sortToggle);

    dispatch({
      type: "LOAD_PROJS",
      payload: sorted,
    });

    dispatch({
      type: "SORT",
      payload: type,
    });
  };

  const { data: rawProjects, error } = useFetch(
    "https://frederico.funfuns.studio/wp-json/wp/v2/posts"
  );

  useEffect(() => {
    // setProjs(rawProjects);
    dispatch({
      type: "LOAD_PROJS",
      payload: rawProjects,
    });
  }, [rawProjects]);

  // Set active_id from slug if initial URL has slug
  useEffect(() => {
    const { slug } = router.query;
    console.log("Querying router for slug...");
    if (slug && appState.projs.size > 0) {
      const next_active_id = appState.projs.find((x) => x.slug === slug).id;

      // Send dispatch to open project
      dispatch({
        type: "OPEN_PROJ",
        payload: next_active_id,
      });

      console.log("active id set from slug: ", appState.active_id);
    }
  }, []);

  const handleProjOpen = (proj_id) => {
    // Send dispatch to open project
    dispatch({
      type: "OPEN_PROJ",
      payload: proj_id,
    });

    const active_proj_slug = appState.projs.find((x) => x.id === proj_id).slug;
    console.log("next active slug: ", active_proj_slug);
    router.push(`/project/${active_proj_slug}`);
  };

  // Setup media query

  return (
    <>
      <div className="layout">
        {/* Header */}
        <div className="header">
          <Link href="/">
            <h1 className="title">Frederico Ramos Lopes</h1>
          </Link>
        </div>

        <div className="blurb">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit
          debitis fugit minima mollitia inventore, maxime earum quia omnis
          corporis accusantium quis laudantium iure obcaecati velit illum
          cupiditate nemo iusto laboriosam sapiente sed eligendi.
        </div>

        {/* Buttons */}
        <div className="proj-list-btns">
          <div className="sort_btn">
            <Button name="by date" onClickHandler={sortData} type="year" />
            <Button name="by title" onClickHandler={sortData} type="title" />
            <Button name="random" onClickHandler={sortData} type="random" />
          </div>
          <div className="filter_btn">
            <Button name="all" onClickHandler={sortData} type="random" />
            <Button name="azul" onClickHandler={sortData} type="random" />
            <Button name="teatro" onClickHandler={sortData} type="random" />
          </div>
        </div>

        {/* Errors */}
        {error && <div className="error">{error}</div>}

        {/* Projects */}
        {appState.projs && <ProjList handleProjOpen={handleProjOpen} />}

        {/* Popovers */}
        {appState.projs &&
          Array.from(appState.proj_ids).map((id) => {
            return (
              <Popover
                proj_id={id}
                // handleProjClose={handleProjClose}
                key={id}
              />
            );
          })}
      </div>

      {/* Children */}
      {children}
    </>
  );
}
