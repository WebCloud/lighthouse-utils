const fs = require('fs');

const LOGO_ICON_PATH = 'src/utils/logoIcon';
const TEMPLATE_CARRIER = 'postnord';

const createFileWithContent = (path, content, help = '') =>
  fs.writeFile(path, content, (err) => err
    ? console.error(err)
    : console.log(`File ${path} created. Reminder: ${help}`)
  );

const cloneFileContent = (templateCarrierId, carrierId, getPath) => {
  const content = fs.readFileSync(getPath(templateCarrierId), 'utf8');
  return content.replace(new RegExp(templateCarrierId, 'g'), carrierId);
};

const createSVGVendorBase = (carrier) => {
  const getPath = (id) => `${LOGO_ICON_PATH}/svg/base/vendor/${id}.js`;

  createFileWithContent(
    getPath(carrier),
    cloneFileContent(TEMPLATE_CARRIER, carrier, getPath),
    'Edit "FillColor" and "default export"'
  );
};

const createSVGVendorMapMarker = (carrier) => {
  const getPath = (id) => `${LOGO_ICON_PATH}/svg/composed/mapMarker/${id}.js`;

  createFileWithContent(
    getPath(carrier),
    cloneFileContent(TEMPLATE_CARRIER, carrier, getPath),
    'Make sure MapMarkerLogoConfig is correct'
  );
};

const createSVGVendorRectangular = (carrier) => {
  const getPath = (id) => `${LOGO_ICON_PATH}/svg/composed/rectangular/${id}.js`;

  createFileWithContent(
    getPath(carrier),
    cloneFileContent(TEMPLATE_CARRIER, carrier, getPath),
    'Make sure RectangularLogoConfig is correct'
  );
};

const createReactLogoComponent = (carrier) => {
  const getPath = (id) => `${LOGO_ICON_PATH}/component/composed/rectangular/${id}.jsx`;

  createFileWithContent(
    getPath(carrier),
    cloneFileContent(TEMPLATE_CARRIER, carrier, getPath)
  );
};

const args = process.argv.slice(2);
const carrier = args[0];

createSVGVendorBase(carrier);
createSVGVendorMapMarker(carrier);
createSVGVendorRectangular(carrier);
createReactLogoComponent(carrier);

console.info(`Make sure you add ${carrier} to AVAILABLE_LOGOS in src/sections/ShippingOptions/logoLoader.tsx`);
