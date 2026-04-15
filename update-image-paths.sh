#!/bin/bash
# Image path update script
# This updates all references from flat /assets/images/ to the new folder structure

BASE="/Users/maximussmith/Desktop/Squarespace/public website"

# Function to update paths in a file
update_file() {
    local file="$1"
    
    # New Aircraft R22
    sed -i '' 's|/assets/images/r22-red-volcano-front-alpha-v3.png|/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png|g' "$file"
    
    # New Aircraft R44
    sed -i '' 's|/assets/images/raven-ii-front-alpha.png|/assets/images/new-aircraft/r44/raven-ii-front-alpha.png|g' "$file"
    
    # New Aircraft R66
    sed -i '' 's|/assets/images/blue-palo-verde-front-right-v4.png|/assets/images/new-aircraft/r66/blue-palo-verde-front-right-v4.png|g' "$file"
    sed -i '' 's|/assets/images/blue-r66-palo-verde-front-v4-1.png|/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4-1.png|g' "$file"
    sed -i '' 's|/assets/images/blue-r66-palo-verde-front-v4.png|/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png|g' "$file"
    sed -i '' 's|/assets/images/blue-r66-palo-verde-left-v4.png|/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png|g' "$file"
    sed -i '' 's|/assets/images/copy-of-r66-riviera-front-right-v2.png|/assets/images/new-aircraft/r66/copy-of-r66-riviera-front-right-v2.png|g' "$file"
    sed -i '' 's|/assets/images/copy-of-r66-riviera-front-v2.png|/assets/images/new-aircraft/r66/copy-of-r66-riviera-front-v2.png|g' "$file"
    sed -i '' 's|/assets/images/copy-of-r66-riviera-left-v2.png|/assets/images/new-aircraft/r66/copy-of-r66-riviera-left-v2.png|g' "$file"
    sed -i '' 's|/assets/images/rhc-r66-nxg-pv-|/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-|g' "$file"
    sed -i '' 's|/assets/images/rhc-r66-nxg-riviera-|/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-|g' "$file"
    
    # New Aircraft R88
    sed -i '' 's|/assets/images/r88-jellybean-left.png|/assets/images/new-aircraft/r88/r88-jellybean-left.png|g' "$file"
    sed -i '' 's|/assets/images/rhc-r88-|/assets/images/new-aircraft/r88/rhc-r88-|g' "$file"
    
    # Used Aircraft R22
    sed -i '' 's|/assets/images/r22-beta-i-|/assets/images/used-aircraft/r22/r22-beta-i-|g' "$file"
    sed -i '' 's|/assets/images/r22-beta-ii-|/assets/images/used-aircraft/r22/r22-beta-ii-|g' "$file"
    sed -i '' 's|/assets/images/r22.jpg|/assets/images/used-aircraft/r22/r22.jpg|g' "$file"
    sed -i '' 's|/assets/images/hq-r22-lineup|/assets/images/used-aircraft/r22/hq-r22-lineup|g' "$file"
    sed -i '' 's|/assets/images/british-team-r22.webp|/assets/images/used-aircraft/r22/british-team-r22.webp|g' "$file"
    sed -i '' 's|/assets/images/getin-on-padf.jpg|/assets/images/used-aircraft/r22/getin-on-padf.jpg|g' "$file"
    
    # Used Aircraft R44
    sed -i '' 's|/assets/images/r44-clipper-ii-|/assets/images/used-aircraft/r44/r44-clipper-ii-|g' "$file"
    sed -i '' 's|/assets/images/r44-raven-ii-|/assets/images/used-aircraft/r44/r44-raven-ii-|g' "$file"
    sed -i '' 's|/assets/images/r44-south-pole.jpg|/assets/images/used-aircraft/r44/r44-south-pole.jpg|g' "$file"
    sed -i '' 's|/assets/images/rrob-tail-rotor.jpg|/assets/images/used-aircraft/r44/rrob-tail-rotor.jpg|g' "$file"
    sed -i '' 's|/assets/images/bgn-robinson-r44-raven-ii-|/assets/images/used-aircraft/r44/bgn-robinson-r44-raven-ii-|g' "$file"
    
    # Used Aircraft R66
    sed -i '' 's|/assets/images/r66-full-cover.jpg|/assets/images/used-aircraft/r66/r66-full-cover.jpg|g' "$file"
    sed -i '' 's|/assets/images/r66-turbine-|/assets/images/used-aircraft/r66/r66-turbine-|g' "$file"
    sed -i '' 's|/assets/images/r66s-2bat-2bhq.jpg|/assets/images/used-aircraft/r66/r66s-2bat-2bhq.jpg|g' "$file"
    sed -i '' 's|/assets/images/r66s-italy.jpg|/assets/images/used-aircraft/r66/r66s-italy.jpg|g' "$file"
    sed -i '' 's|/assets/images/chris-r66-alps.jpg|/assets/images/used-aircraft/r66/chris-r66-alps.jpg|g' "$file"
    sed -i '' 's|/assets/images/n44829.jpg|/assets/images/used-aircraft/r66/n44829.jpg|g' "$file"
    sed -i '' 's|/assets/images/hkcc.jpg|/assets/images/used-aircraft/r66/hkcc.jpg|g' "$file"
    sed -i '' 's|/assets/images/ghkhm.jpg|/assets/images/used-aircraft/r66/ghkhm.jpg|g' "$file"
    sed -i '' 's|/assets/images/ghver.jpg|/assets/images/used-aircraft/r66/ghver.jpg|g' "$file"
    sed -i '' 's|/assets/images/ghver-1.jpg|/assets/images/used-aircraft/r66/ghver-1.jpg|g' "$file"
    sed -i '' 's|/assets/images/gniog.jpg|/assets/images/used-aircraft/r66/gniog.jpg|g' "$file"
    sed -i '' 's|/assets/images/gdspz.jpg|/assets/images/used-aircraft/r66/gdspz.jpg|g' "$file"
    sed -i '' 's|/assets/images/gold-on-pad.jpg|/assets/images/used-aircraft/r66/gold-on-pad.jpg|g' "$file"
    
    # Used Aircraft Other
    sed -i '' 's|/assets/images/as350-tr.jpg|/assets/images/used-aircraft/other/as350-tr.jpg|g' "$file"
    sed -i '' 's|/assets/images/eurocopter-|/assets/images/used-aircraft/other/eurocopter-|g' "$file"
    sed -i '' 's|/assets/images/gsasy.jpg|/assets/images/used-aircraft/other/gsasy.jpg|g' "$file"
    sed -i '' 's|/assets/images/gsapa|/assets/images/used-aircraft/other/gsapa|g' "$file"
    sed -i '' 's|/assets/images/hughes-369e-gumby.jpg|/assets/images/used-aircraft/other/hughes-369e-gumby.jpg|g' "$file"
    
    # Facility
    sed -i '' 's|/assets/images/busy-hangar.jpg|/assets/images/facility/busy-hangar.jpg|g' "$file"
    sed -i '' 's|/assets/images/hangar.png|/assets/images/facility/hangar.png|g' "$file"
    sed -i '' 's|/assets/images/hangarage.png|/assets/images/facility/hangarage.png|g' "$file"
    sed -i '' 's|/assets/images/helicopter-hangar.png|/assets/images/facility/helicopter-hangar.png|g' "$file"
    sed -i '' 's|/assets/images/hq-aviation-helicopter-hangar.webp|/assets/images/facility/hq-aviation-helicopter-hangar.webp|g' "$file"
    sed -i '' 's|/assets/images/hq-helicopter-hangarage-the-robinson-specialists-|/assets/images/facility/hq-helicopter-hangarage-the-robinson-specialists-|g' "$file"
    sed -i '' 's|/assets/images/hq-aviation-robinsons.jpg|/assets/images/facility/hq-aviation-robinsons.jpg|g' "$file"
    sed -i '' 's|/assets/images/hq-aviation-the-robinson-specialists-|/assets/images/facility/hq-aviation-the-robinson-specialists-|g' "$file"
    sed -i '' 's|/assets/images/denham-aerodrome.png|/assets/images/facility/denham-aerodrome.png|g' "$file"
    sed -i '' 's|/assets/images/hq-0|/assets/images/facility/hq-0|g' "$file"
    sed -i '' 's|/assets/images/hq-img_1340.jpg|/assets/images/facility/hq-img_1340.jpg|g' "$file"
    sed -i '' 's|/assets/images/g-ccfc-hq-robinson-overhaul.webp|/assets/images/facility/g-ccfc-hq-robinson-overhaul.webp|g' "$file"
    sed -i '' 's|/assets/images/maintenance-.jpg|/assets/images/facility/maintenance-.jpg|g' "$file"
    sed -i '' 's|/assets/images/sales-rebuild.jpg|/assets/images/facility/sales-rebuild.jpg|g' "$file"
    sed -i '' 's|/assets/images/sales-used.jpg|/assets/images/facility/sales-used.jpg|g' "$file"
    sed -i '' 's|/assets/images/main-sales-pic|/assets/images/facility/main-sales-pic|g' "$file"
    sed -i '' 's|/assets/images/washing.jpg|/assets/images/facility/washing.jpg|g' "$file"
    sed -i '' 's|/assets/images/okey-paint-quality.jpg|/assets/images/facility/okey-paint-quality.jpg|g' "$file"
    
    # Team
    sed -i '' 's|/assets/images/quentin-smith-world-record-holder-helicopter-aerobatics.webp|/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp|g' "$file"
    sed -i '' 's|/assets/images/world-helicopter-champion-quentin-smith.webp|/assets/images/team/world-helicopter-champion-quentin-smith.webp|g' "$file"
    sed -i '' 's|/assets/images/helicopter-genius-quentin-smith-great-britain.webp|/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp|g' "$file"
    sed -i '' 's|/assets/images/helicopter-lands-on-a-car-2c-top-gear-2c-quentin-smith.webp|/assets/images/team/helicopter-lands-on-a-car-2c-top-gear-2c-quentin-smith.webp|g' "$file"
    sed -i '' 's|/assets/images/british-helicopter-team.jpg|/assets/images/team/british-helicopter-team.jpg|g' "$file"
    sed -i '' 's|/assets/images/british-helicopter-team.webp|/assets/images/team/british-helicopter-team.webp|g' "$file"
    sed -i '' 's|/assets/images/new-team-rx-racing-for-print.jpg|/assets/images/team/new-team-rx-racing-for-print.jpg|g' "$file"
    sed -i '' 's|/assets/images/q-dubai.jpg|/assets/images/team/q-dubai.jpg|g' "$file"
    sed -i '' 's|/assets/images/for-england-282-29.jpg|/assets/images/team/for-england-282-29.jpg|g' "$file"
    
    # Expeditions
    sed -i '' 's|/assets/images/antartica.jpg|/assets/images/expeditions/antartica.jpg|g' "$file"
    sed -i '' 's|/assets/images/north-pole.jpg|/assets/images/expeditions/north-pole.jpg|g' "$file"
    sed -i '' 's|/assets/images/south-pole-by-helicopter-quentin-smith.webp|/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp|g' "$file"
    sed -i '' 's|/assets/images/helicopter-expeditions-quentin-smith.webp|/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp|g' "$file"
    sed -i '' 's|/assets/images/channel.jpg|/assets/images/expeditions/channel.jpg|g' "$file"
    
    # Lifestyle
    sed -i '' 's|/assets/images/superyacht-ops.jpg|/assets/images/lifestyle/superyacht-ops.jpg|g' "$file"
    sed -i '' 's|/assets/images/yacht-landing.jpg|/assets/images/lifestyle/yacht-landing.jpg|g' "$file"
    sed -i '' 's|/assets/images/rala-hotel.jpg|/assets/images/lifestyle/rala-hotel.jpg|g' "$file"
    sed -i '' 's|/assets/images/london-battersea-heliport.jpg|/assets/images/lifestyle/london-battersea-heliport.jpg|g' "$file"
    
    # Logos HQ
    sed -i '' 's|/assets/images/hq-aviation-logo-black.png|/assets/images/logos/hq/hq-aviation-logo-black.png|g' "$file"
    sed -i '' 's|/assets/images/hq-aviation-social-icon|/assets/images/logos/hq/hq-aviation-social-icon|g' "$file"
    sed -i '' 's|/assets/images/logo-281-29.png|/assets/images/logos/hq/logo-281-29.png|g' "$file"
    
    # Logos Certifications
    sed -i '' 's|/assets/images/caa.jpg|/assets/images/logos/certifications/caa.jpg|g' "$file"
    sed -i '' 's|/assets/images/easa1.png|/assets/images/logos/certifications/easa1.png|g' "$file"
    sed -i '' 's|/assets/images/faa-logo.jpg|/assets/images/logos/certifications/faa-logo.jpg|g' "$file"
    sed -i '' 's|/assets/images/fai-logo.png|/assets/images/logos/certifications/fai-logo.png|g' "$file"
    sed -i '' 's|/assets/images/hcgb-logo.png|/assets/images/logos/certifications/hcgb-logo.png|g' "$file"
    sed -i '' 's|/assets/images/logo_robinson_authorized_repair_center1.jpg|/assets/images/logos/certifications/logo_robinson_authorized_repair_center1.jpg|g' "$file"
    sed -i '' 's|/assets/images/rhc.png|/assets/images/logos/certifications/rhc.png|g' "$file"
    sed -i '' 's|/assets/images/robinson.jpg|/assets/images/logos/certifications/robinson.jpg|g' "$file"
    
    # Logos Partners
    sed -i '' 's|/assets/images/air-covers-logo-15s-rgb.jpg|/assets/images/logos/partners/air-covers-logo-15s-rgb.jpg|g' "$file"
    sed -i '' 's|/assets/images/aircovers.png|/assets/images/logos/partners/aircovers.png|g' "$file"
    sed -i '' 's|/assets/images/as-aerospace-logo.jpg|/assets/images/logos/partners/as-aerospace-logo.jpg|g' "$file"
    sed -i '' 's|/assets/images/bhalogo.jpg|/assets/images/logos/partners/bhalogo.jpg|g' "$file"
    sed -i '' 's|/assets/images/blackjetfilm_logoshield_black.png|/assets/images/logos/partners/blackjetfilm_logoshield_black.png|g' "$file"
    sed -i '' 's|/assets/images/capt-online.png|/assets/images/logos/partners/capt-online.png|g' "$file"
    sed -i '' 's|/assets/images/elstree-helicopters.jpg|/assets/images/logos/partners/elstree-helicopters.jpg|g' "$file"
    sed -i '' 's|/assets/images/hayward-fleet-insurance-copy.png|/assets/images/logos/partners/hayward-fleet-insurance-copy.png|g' "$file"
    sed -i '' 's|/assets/images/helipaddy-logo-plain-1.png|/assets/images/logos/partners/helipaddy-logo-plain-1.png|g' "$file"
    sed -i '' 's|/assets/images/helipaddy.png|/assets/images/logos/partners/helipaddy.png|g' "$file"
    sed -i '' 's|/assets/images/heliservices.png|/assets/images/logos/partners/heliservices.png|g' "$file"
    sed -i '' 's|/assets/images/heliservices-1.png|/assets/images/logos/partners/heliservices-1.png|g' "$file"
    sed -i '' 's|/assets/images/hft-logo-1.jpg|/assets/images/logos/partners/hft-logo-1.jpg|g' "$file"
    sed -i '' 's|/assets/images/logo-shc.jpg|/assets/images/logos/partners/logo-shc.jpg|g' "$file"
    sed -i '' 's|/assets/images/met-office.jpg|/assets/images/logos/partners/met-office.jpg|g' "$file"
    sed -i '' 's|/assets/images/phoenix-helicopters.jpg|/assets/images/logos/partners/phoenix-helicopters.jpg|g' "$file"
    sed -i '' 's|/assets/images/pooleys-logo-large.jpg|/assets/images/logos/partners/pooleys-logo-large.jpg|g' "$file"
    sed -i '' 's|/assets/images/pooleys.png|/assets/images/logos/partners/pooleys.png|g' "$file"
    sed -i '' 's|/assets/images/robinson-helicopter-shop.jpg|/assets/images/logos/partners/robinson-helicopter-shop.jpg|g' "$file"
    sed -i '' 's|/assets/images/salt-logo-red.jpg|/assets/images/logos/partners/salt-logo-red.jpg|g' "$file"
    sed -i '' 's|/assets/images/sharman_logo-1.jpg|/assets/images/logos/partners/sharman_logo-1.jpg|g' "$file"
    sed -i '' 's|/assets/images/skytech-helicopters.jpg|/assets/images/logos/partners/skytech-helicopters.jpg|g' "$file"
    sed -i '' 's|/assets/images/sloane-helicopters.jpg|/assets/images/logos/partners/sloane-helicopters.jpg|g' "$file"
    sed -i '' 's|/assets/images/startstick-logo-header-grey.png|/assets/images/logos/partners/startstick-logo-header-grey.png|g' "$file"
    sed -i '' 's|/assets/images/windyty.png|/assets/images/logos/partners/windyty.png|g' "$file"
    sed -i '' 's|/assets/images/heliroutes.jpg|/assets/images/logos/partners/heliroutes.jpg|g' "$file"
    sed -i '' 's|/assets/images/hcgb.jpg|/assets/images/logos/partners/hcgb.jpg|g' "$file"
    
    # Training
    sed -i '' 's|/assets/images/home-2312.jpg|/assets/images/training/home-2312.jpg|g' "$file"
    
    # UI
    sed -i '' 's|/assets/images/play-button.png|/assets/images/ui/play-button.png|g' "$file"
    sed -i '' 's|/assets/images/social-accounts.svg|/assets/images/ui/social-accounts.svg|g' "$file"
    sed -i '' 's|/assets/images/ui-icons.svg|/assets/images/ui/ui-icons.svg|g' "$file"
    sed -i '' 's|/assets/images/image-inside-64-dark.png|/assets/images/ui/image-inside-64-dark.png|g' "$file"
    sed -i '' 's|/assets/images/logbook.webp|/assets/images/ui/logbook.webp|g' "$file"
    sed -i '' 's|/assets/images/300x250_standardmpu.jpg|/assets/images/ui/300x250_standardmpu.jpg|g' "$file"
    
    # Gallery
    sed -i '' 's|/assets/images/dsc_|/assets/images/gallery/events/dsc_|g' "$file"
    sed -i '' 's|/assets/images/img_|/assets/images/gallery/events/img_|g' "$file"
    sed -i '' 's|/assets/images/p1140516.jpg|/assets/images/gallery/events/p1140516.jpg|g' "$file"
    sed -i '' 's|/assets/images/flying-|/assets/images/gallery/flying/flying-|g' "$file"
    sed -i '' 's|/assets/images/foggy-evening-flying.jpg|/assets/images/gallery/flying/foggy-evening-flying.jpg|g' "$file"
    sed -i '' 's|/assets/images/james-shadow-night.jpg|/assets/images/gallery/flying/james-shadow-night.jpg|g' "$file"
    sed -i '' 's|/assets/images/rotating|/assets/images/gallery/carousel/rotating|g' "$file"
    sed -i '' 's|/assets/images/img-20|/assets/images/gallery/social/img-20|g' "$file"
    sed -i '' 's|/assets/images/whatsapp-image-|/assets/images/gallery/social/whatsapp-image-|g' "$file"
    
    # Legacy
    sed -i '' 's|/assets/images/1378761_|/assets/images/legacy/facebook/1378761_|g' "$file"
    sed -i '' 's|/assets/images/1380382_|/assets/images/legacy/facebook/1380382_|g' "$file"
    sed -i '' 's|/assets/images/20130921_|/assets/images/legacy/dated/20130921_|g' "$file"
    sed -i '' 's|/assets/images/20130922_|/assets/images/legacy/dated/20130922_|g' "$file"
    sed -i '' 's|/assets/images/2015-04-|/assets/images/legacy/dated/2015-04-|g' "$file"
    sed -i '' 's|/assets/images/2015-08-|/assets/images/legacy/dated/2015-08-|g' "$file"
    sed -i '' 's|/assets/images/20230421_|/assets/images/legacy/dated/20230421_|g' "$file"
    sed -i '' 's|/assets/images/20251024_|/assets/images/legacy/dated/20251024_|g' "$file"
    sed -i '' 's|/assets/images/20251217_|/assets/images/legacy/dated/20251217_|g' "$file"
    sed -i '' 's|/assets/images/image-asset|/assets/images/legacy/squarespace/image-asset|g' "$file"
    sed -i '' 's|/assets/images/gemini_generated_image_|/assets/images/legacy/misc/gemini_generated_image_|g' "$file"
}

echo "Starting image path updates..."

# Find and update all HTML files
find "$BASE" -name "*.html" -type f | while read file; do
    echo "Updating: $file"
    update_file "$file"
done

# Find and update all JS files
find "$BASE/public/assets/js" -name "*.js" -type f 2>/dev/null | while read file; do
    echo "Updating: $file"
    update_file "$file"
done

echo "Done!"
