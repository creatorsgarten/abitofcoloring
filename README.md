# a bit of coloring

In [_a bit of thai tunes_](https://www.facebook.com/creatorsgarten/videos/1695835374279309), an algorave event at [Museum Siam](https://en.wikipedia.org/wiki/Museum_Siam) that featured algorithmic art and live coding, with visuals projected onto the museum’s facade, we implemented an interactive experiment that allowed visitors to color the museum facade using their mobile phones.

<!-- prettier-ignore -->
| Mobile phone | Projection |
| ------------ | ---------- |
| ![phonescreen](https://github.com/creatorsgarten/abitofthaitunes-interactive/assets/193136/c5ecea8c-6150-4916-9b37-f9ff9a29f1db) | ![image](https://github.com/creatorsgarten/abitofthaitunes-interactive/assets/193136/49a1f3f0-4f81-4390-847a-a839834f4246) |

This show has 3 phases. In the first phase, visitors are invited to color the museum facade.

https://github.com/creatorsgarten/abitofcoloring/assets/193136/3552ca4f-cbb7-428f-95a1-21a2f3227af3

In the second phase, visitors can choose an icon to show, and the previously-selected icon will pop out. In the final phase, each color corresponds to a note. A mallet sound will be played based on the color of the facade, accompanied by me playing the piano ([using a computer keyboard](https://docs.dt.in.th/webmidicon/midi-keybindings.html)).

https://github.com/creatorsgarten/abitofcoloring/assets/193136/a9ad6b9b-63d5-4407-9feb-4b754d509f55

## Tech stack

This project took me ([@dtinth](https://github.com/dtinth)) about 6 hours to make. It was created on the same day as its premiere. Without these tools, this project would not have been possible in such a short time frame:

- **Firebase Realtime Database** for the backend. This saves a lot of time as this project is implemented entirely on the client-side, with no server-side code. Firebase SDK also manages unreliable internet connections and conflicting updates, which would otherwise require significant effort to implement manually using WebSockets.

- **GitHub Copilot** for AI-assisted code completions. [GitHub Copilot completed most of my code.](https://twitter.com/dtinth/status/1639152753040834560) When I want to do something, I already know the high-level details, but I didn’t remember the exact API signature. Without Copilot, it would cost a lot of time having to look up the correct API signature in the docs. For example, I entered `const lpf =`, and it knows I need a low-pass filter, so it completed the remaining code: `const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass';`.

- **Remix (SPA mode)** for an easy-to-use React app setup with file-based routing.

- **Vite** for a remarkable hot-reloading experience, tightening the feedback loop.

- **Nano Stores** for state management. It’s easy to use and doesn’t get in the way.

```sh
pnpm run dev
```
