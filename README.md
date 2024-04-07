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

- **Firebase Realtime Database** for the backend. This saves a lot of time as this project is implemented entirely on the client-side, with no server-side code. Firebase SDK also manages auto-reconnection (on unreliable internet connections) and conflicting updates, which would otherwise require significant effort to implement manually using WebSockets.

- **GitHub Copilot** for AI-assisted code completions. [GitHub Copilot completed most of my code.](https://twitter.com/dtinth/status/1639152753040834560) When I want to do something, I already know the high-level details, but I didn’t remember the exact API signature. Without Copilot, it would cost a lot of time having to look up the correct API signature in the docs. For example, I entered `const lpf =`, and it knows I need a low-pass filter, so it completed the remaining code: `const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass';`.

- **Remix (SPA mode)** for an easy-to-use React app setup with file-based routing.

- **Vite** for a remarkable hot-reloading experience, tightening the feedback loop.

- **Nano Stores** for state management. It’s easy to use and doesn’t get in the way.

- **Tailwind CSS** for styling. It helps me to iterate very quickly on the visual aspects of the project.

- **Figma** for creating image assets and measuring the sizes and positions of elements.

This is a screenshot of my Figma file at the end of the project:

<img width="943" alt="image" src="https://github.com/creatorsgarten/abitofcoloring/assets/193136/71c80990-0da1-4e75-a963-b7fa7e6ebdcb">

## Projection

[Museum Siam’s Wikipedia page](<https://en.wikipedia.org/wiki/Museum_Siam#/media/File:Museum_Siam_(III).jpg>) has a photo of the facade. The first thing I did when creating the scene was to create a debug mode (toggled with a shortcut key) that would overlay the facade image on top of the visuals (using [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode), simulating a projector). This step helped me get visual alignment with the facade. This debug mode later became useful when aligning visuals on the actual facade. It helps the projectionist adjust the projector without having to guess where the visuals should be.

<!-- prettier-ignore -->
| Debugging off | Debugging on |
| ------------- | ------------ |
| ![debug-off](https://github.com/creatorsgarten/abitofcoloring/assets/193136/8d605fdf-30dc-4a38-8bd5-d12789da090b) | ![debug-on](https://github.com/creatorsgarten/abitofcoloring/assets/193136/778df542-653f-4bac-85dd-a4e435de3e2f) |

The projector accepts a 1920x1080 (16:9) signal via HDMI, however, the facade has a different aspect ratio of 36:25. The projector squishes the image to fit the facade. To compensate for this, my visuals have to be stretched to 1920x1080. This is done using CSS transforms.

<img width="556" alt="image" src="https://github.com/creatorsgarten/abitofcoloring/assets/193136/85d2138d-2ac6-433b-91b7-37d9a57f6188">
