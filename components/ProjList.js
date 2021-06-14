import Image from "next/image";
import Link from "next/link";

import { useAppState } from "./AppContext";

export default function ProjList({ sorter, handleProjOpen }) {
  const appState = useAppState();

  return (
    <div className="proj-list">
      <div className="projs">
        {appState.projs.map((proj) => {
          return (
            <div
              key={proj.id}
              className={`proj ${appState.proj_ids.has(proj.id) && "active"}`}
              onClick={() => handleProjOpen(proj.id)}
            >
              <div className="proj-box">
                <div className="proj-box-title">{proj.title}</div>
                <div className="proj-box-year">{proj.year}</div>
              </div>
              {proj.images.map((ii) => (
                <div key={ii.image} className="proj-box">
                  <img src={ii.image} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
