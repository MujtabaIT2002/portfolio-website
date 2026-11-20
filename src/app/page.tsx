import Portfolio from "@/ui/Portfolio";
import { PROFILE, EXPERIENCE, PROJECTS, SKILLS, LINKS } from "@/data/cv";

export default function Home() {
  return (
    <>
      <Portfolio />
      {/* Plain-text résumé for screen readers, search engines and no-JS visitors */}
      <article className="sr-only">
        <h1>
          {PROFILE.name} — {PROFILE.title}
        </h1>
        <p>{PROFILE.summary}</p>
        <h2>Experience</h2>
        {EXPERIENCE.map((r) => (
          <section key={r.id}>
            <h3>
              {r.role} — {r.company} ({r.start} – {r.end ?? "Present"})
            </h3>
            <ul>
              {r.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Projects</h2>
        {PROJECTS.map((p) => (
          <section key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.blurb}</p>
          </section>
        ))}
        <h2>Skills</h2>
        <p>{SKILLS.flatMap((g) => g.items.map((i) => i.name)).join(", ")}</p>
        <h2>Contact</h2>
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
