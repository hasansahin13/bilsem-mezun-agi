"use client";

import { useEffect, useRef } from "react";

type Alumni = {
  id: string;
  full_name: string;
  university?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export default function CesiumMap({
  alumni,
}: {
  alumni: Alumni[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;

    async function start() {
      try {
        // Cesium dosyalarının yolu
        (window as any).CESIUM_BASE_URL = "/cesium/";

        // Cesium'u yükle
        const Cesium = await import("cesium");

        if (cancelled || !containerRef.current) {
          return;
        }

        // Cesium Ion
        const token =
          process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

        if (token) {
          Cesium.Ion.defaultAccessToken = token;
        }

        // ==================================================
        // CESIUM HARİTASI
        // ==================================================

        viewer = new Cesium.Viewer(
          containerRef.current,
          {
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false,

            // Uydu görüntüsü + şehir/yol/yer etiketleri
            baseLayer:
              Cesium.ImageryLayer.fromWorldImagery({
                style:
                  Cesium.IonWorldImageryStyle
                    .AERIAL_WITH_LABELS,
              } as any),

            // Dünya yüzeyi
            terrainProvider:
              new Cesium.EllipsoidTerrainProvider(),
          }
        );

        // ==================================================
        // MOBİL DOKUNMATİK KAMERA KONTROLLERİ
        // ==================================================

        const cameraController =
          viewer.scene.screenSpaceCameraController;

        cameraController.enableInputs = true;
        cameraController.enableZoom = true;
        cameraController.enableRotate = true;
        cameraController.enableTilt = true;
        cameraController.enableTranslate = true;

        // ==================================================
        // HARİTA GÖRÜNTÜ AYARLARI
        // ==================================================

        viewer.scene.globe.enableLighting = true;

        viewer.scene.globe.depthTestAgainstTerrain =
          false;

        // Türkiye'ye odaklan
        viewer.camera.setView({
          destination:
            Cesium.Cartesian3.fromDegrees(
              35,
              39,
              3500000
            ),
        });

        // ==================================================
        // MEZUNLARI HARİTAYA EKLE
        // ==================================================

        alumni.forEach((person) => {
          if (
            person.latitude == null ||
            person.longitude == null
          ) {
            return;
          }

          // ----------------------------------------------
          // AYNI ŞEHİRDEKİ MEZUNLARI BUL
          // ----------------------------------------------

          const cityMembers = alumni.filter(
            (x) =>
              x.city === person.city &&
              x.country === person.country
          );

          const cityIndex =
            cityMembers.findIndex(
              (x) => x.id === person.id
            );

          const totalInCity =
            cityMembers.length;

          // ----------------------------------------------
          // GÖSTERİM KOORDİNATI
          // ----------------------------------------------

          let displayLatitude =
            Number(person.latitude);

          let displayLongitude =
            Number(person.longitude);

          // Aynı şehirde birden fazla kişi varsa
          // noktaları şehir merkezi çevresine dağıt.
          if (totalInCity > 1) {
            // Yaklaşık dağılım alanı
            const radius = 0.012;

            // Altın açı
            const angle =
              cityIndex *
              137.508 *
              (Math.PI / 180);

            // Merkezden uzaklık
            const distance =
              radius *
              Math.sqrt(
                (cityIndex + 1) /
                  totalInCity
              );

            // Enlem
            displayLatitude +=
              Math.sin(angle) *
              distance;

            // Boylam
            displayLongitude +=
              (Math.cos(angle) *
                distance) /
              Math.cos(
                displayLatitude *
                  (Math.PI / 180)
              );
          }

          // ==================================================
          // MEZUN NOKTASI
          // ==================================================

          const entity =
            viewer.entities.add({
              id: person.id,

              position:
                Cesium.Cartesian3.fromDegrees(
                  displayLongitude,
                  displayLatitude
                ),

              // --------------------------------------------
              // NOKTA
              // --------------------------------------------

              point: {
                pixelSize: 12,

                color:
                  Cesium.Color.fromCssColorString(
                    "#00e5ff"
                  ),

                outlineColor:
                  Cesium.Color.WHITE,

                outlineWidth: 2,

                disableDepthTestDistance:
                  Number.POSITIVE_INFINITY,
              },

              // --------------------------------------------
              // MEZUN İSMİ
              // --------------------------------------------

              label: {
                text: person.city
                  ? `${person.full_name}\n${person.city}`
                  : person.full_name,

                font:
                  "bold 14px Arial",

                fillColor:
                  Cesium.Color.WHITE,

                outlineColor:
                  Cesium.Color.BLACK,

                outlineWidth: 3,

                style:
                  Cesium.LabelStyle
                    .FILL_AND_OUTLINE,

                verticalOrigin:
                  Cesium.VerticalOrigin.BOTTOM,

                pixelOffset:
                  new Cesium.Cartesian2(
                    0,
                    -15
                  ),

                // Sadece mouse üzerine gelince göster
                show: false,

                disableDepthTestDistance:
                  Number.POSITIVE_INFINITY,
              },
            });

          // ==================================================
          // PROFİL BİLGİSİ
          // ==================================================

          entity.description = `
            <div style="
              padding:12px;
              font-family:Arial,sans-serif;
            ">

              <h3 style="
                margin:0 0 10px 0;
              ">
                ${person.full_name}
              </h3>

              ${
                person.university
                  ? `
                    <p>
                      <b>Üniversite:</b>
                      ${person.university}
                    </p>
                  `
                  : ""
              }

              ${
                person.city
                  ? `
                    <p>
                      <b>Şehir:</b>
                      ${person.city}
                    </p>
                  `
                  : ""
              }

              ${
                person.country
                  ? `
                    <p>
                      <b>Ülke:</b>
                      ${person.country}
                    </p>
                  `
                  : ""
              }

            </div>
          `;
        });

        // ==================================================
        // MOUSE HAREKETİ
        // ==================================================

        const handler =
          new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
          );

        handler.setInputAction(
          (movement: any) => {
            // Önce bütün isimleri gizle
            viewer.entities.values.forEach(
              (entity: any) => {
                if (entity.label) {
                  entity.label.show = false;
                }
              }
            );

            // Mouse'un üzerindeki nesne
            const picked =
              viewer.scene.pick(
                movement.endPosition
              );

            if (
              Cesium.defined(picked) &&
              picked.id &&
              picked.id.label
            ) {
              picked.id.label.show = true;
            }
          },
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );

        // ==================================================
        // NOKTAYA TIKLAYINCA PROFİLE GİT
        // ==================================================

        handler.setInputAction(
          (click: any) => {
            const picked =
              viewer.scene.pick(
                click.position
              );

            if (
              Cesium.defined(picked) &&
              picked.id &&
              picked.id.id
            ) {
              window.location.href =
                `/alumni/${picked.id.id}`;
            }
          },
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        // ==================================================
        // HARİTA BOYUTUNU OTOMATİK AYARLA
        // ==================================================

        if (containerRef.current) {
          const resizeObserver =
            new ResizeObserver(() => {
              if (
                viewer &&
                !viewer.isDestroyed()
              ) {
                viewer.resize();
              }
            });

          resizeObserver.observe(
            containerRef.current
          );

          (
            viewer as any
          )._resizeObserver =
            resizeObserver;
        }

        (
          viewer as any
        )._inputHandler = handler;
      } catch (error) {
        console.error(
          "CESIUM HATASI:",
          error
        );
      }
    }

    start();

    // ==================================================
    // TEMİZLEME
    // ==================================================

    return () => {
      cancelled = true;

      if (
        viewer &&
        !viewer.isDestroyed()
      ) {
        // ResizeObserver
        if (
          (viewer as any)
            ._resizeObserver
        ) {
          (
            viewer as any
          )._resizeObserver.disconnect();
        }

        // Mouse handler
        if (
          (viewer as any)
            ._inputHandler
        ) {
          (
            viewer as any
          )._inputHandler.destroy();
        }

        viewer.destroy();
      }
    };
  }, [alumni]);

  return (
    <div
      ref={containerRef}
      className="cesiumContainer"
      style={{ touchAction: "none" }}
    />
  );
}