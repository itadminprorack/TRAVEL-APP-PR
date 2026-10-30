# ProRack Move - generated asset manifest

15 newly generated raster images replace the remaining scene and spot illustrations in the running application. They are bundled locally and optimized for the light theme.

| File in `src/assets/generated/` | Runtime size | Placement |
|---|---|---|
| `bus-v3.png` | 576 x 384 (transparent) | Allocation selector and bus trips |
| `van-v3.png` | 576 x 384 (transparent) | Allocation, manager preferences and van trips |
| `car-v3.png` | 576 x 384 (transparent) | Allocation, manager preferences, car trips and client visits |
| `train-v3.png` | 576 x 384 (transparent) | Allocation and manager preferences |
| `flight-v3.png` | 576 x 384 (transparent) | Allocation, manager preferences and Other travel purpose |
| `sea-v3.png` | 576 x 384 (transparent) | Allocation and manager preferences |
| `planning-v3.png` | 576 x 384 (transparent) | Request sidebar, Training purpose, travel guide and calendar empty states |
| `team-v3.png` | 576 x 384 (transparent) | Project-work purpose, team directory and dashboard guide |
| `approval-v3.png` | 576 x 384 (transparent) | Request review and Meeting purpose |
| `empty-requests-v3.png` | 576 x 384 (transparent) | Empty requests and travel history |
| `success-v3.png` | 576 x 384 (transparent) | Successful actions and clear-inbox state |
| `location-pin-v3.png` | 576 x 384 (transparent) | Site-visit purpose, settings and empty route state |
| `analytics-v3.png` | 576 x 384 (transparent) | Reports introduction |
| `notifications-v3.png` | 576 x 384 (transparent) | Notification empty state |
| `route-planning-v3.jpg` | 1200 x 600 | Admin overview and route-planning scene |

Existing generated hero images remain in use: `src/assets/welcome-journey-v2.jpg` for welcome and `src/assets/campus-shuttle.jpg` for employee home. The shared icon system supplies navigation and control icons.

## Sources, prompts and verification

- Generation: built-in imagegen tool, one distinct generation per asset.
- Full-resolution masters: `output/imagegen/v3/<asset-name>-master.png`.
- Exact prompts and placements: [docs/GENERATED_ASSETS_V3.md](docs/GENERATED_ASSETS_V3.md).
- Gallery: [open locally](http://localhost:5173/preview/ui-transformation/asset-gallery.html).
- The prior vector collection is retained in `src/assets/illustrations/` as an archive. The application illustration helper now resolves to the generated PNG set.
- The route scene is conceptual artwork. Actual pickup data remains in the existing planning UI; road feasibility is not verified by the image.

The static build recursively includes the generated assets directory.
