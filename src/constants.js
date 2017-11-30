import I18n from 'react-native-i18n';
import { Icons, Images } from '@theme';

const constants = {

    customDayHeadings: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    customMonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    mapDelta: [0.028],
    jobStatus: {Pending: 0, Purchased: 1, Accepted: 2, Declined: 3, Completed: 4},
    IP_BUTTONS: [
        { key: 0, name: I18n.t('TAKE_PHOTO') },
        { key: 1, name: I18n.t('PICK_FROM_LIBRARY') },
        { key: 2, label: I18n.t('CANCEL') },
    ],
    IN_APP_PRODUCT: [
        {from: 1, to: 29, price: 0.99, unit: '€'},
        {from: 30, to: 39, price: 3, unit: '€'},
        {from: 40, to: 49, price: 4, unit: '€'},
        {from: 50, to: 59, price: 5, unit: '€'},
        {from: 60, to: 69, price: 6, unit: '€'},
        {from: 70, to: 79, price: 7, unit: '€'},
        {from: 80, to: 89, price: 8, unit: '€'},
        {from: 91, to: 100, price: 9, unit: '€'},
        {from: 101, to: 110, price: 10, unit: '€'},
        {from: 111, to: 120, price: 11.5, unit: '€'},
        {from: 121, to: 130, price: 12, unit: '€'},
        {from: 131, to: 140, price: 12.5, unit: '€'},
        {from: 141, to: 150, price: 13.5, unit: '€'},
        {from: 151, to: 160, price: 14.5, unit: '€'},
        {from: 161, to: 170, price: 17.5, unit: '€'},
        {from: 171, to: 180, price: 18.5, unit: '€'},
        {from: 181, to: 190, price: 19, unit: '€'},
        {from: 191, to: 200, price: 20, unit: '€'},
        {from: 201, to: 210, price: 21, unit: '€'},
        {from: 211, to: 220, price: 22, unit: '€'},
        {from: 221, to: 230, price: 23, unit: '€'},
        {from: 231, to: 240, price: 24, unit: '€'},
        {from: 241, to: 250, price: 25, unit: '€'},
        {from: 251, to: -1, price: 30, unit: '€'},
    ],
    ownerEmail: 'hilfe@stylenow.style',
    ownerPhoneNo: '4915221505736',

    //Dummy Data
    RATINGS: [
        { key: 0, name: 'Martin', date: '5. April 2017', avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg', rating: 4.5, description: 'Martin is a great Masseur, I tested several people here in this App, but he is the best in what he is doing' },
        { key: 1, name: 'Armen', date: '5. July 2017', avatar: 'https://s17.postimg.org/grqilj7p7/image.jpg', rating: 4, description: 'Armen is a great Masseur, I tested several people here in this App, but he is the best in what he is doing' },
    ],
    REQUESTS: [
        {
            key: 0,
            name: 'Tanja Richter',
            avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg',
            requests: [
                { id: 0, skill: 'Make Up', price: 130, times: 1 },
                { id: 1, skill: 'Augenschminke', price: 70, times: 1 },
                { id: 2, skill: 'Lidschatten', price: 80, times: 1 }],
            address: 'Max - Mustermann - Str.4',
            date: '11. Mai 2017',
            time: '16:30',
            allprice: 280,
            phone: '+49 123/4567890',
            accepted: 0,
        },
        {
            key: 1,
            name: 'James',
            avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg',
            requests: [
                { id: 0, skill: 'Make Up', price: 130, times: 1 },
                { id: 1, skill: 'Augenschminke', price: 70, times: 1 },
                { id: 2, skill: 'Lidschatten', price: 80, times: 1 }],
            address: 'Max - Mustermann - Str.4',
            date: '11. Mai 2017',
            time: '16:30',
            phone: '+49 123/4567890',
            allprice: 280,
            accepted: 2,
        },
    ],
    LOCATIONS: [
        { id: 0, latitude: 47.953765, longitude: 11.643326, name: 'Pos1', description: 'welcome to here!!!', skill: [0,1,2], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
        { id: 1, latitude: 47.953912, longitude: 11.643767, name: 'Pos2', description: 'welcome to here!!!', skill: [0,1,2], avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg' },
        { id: 2, latitude: 47.954113, longitude: 11.643787, name: 'Pos3', description: 'welcome to here!!!', skill: [3,1,2], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
        { id: 3, latitude: 47.954087, longitude: 11.643367, name: 'Pos4', description: 'welcome to here!!!', skill: [4,1,2], avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg' },
        { id: 4, latitude: 47.953681, longitude: 11.643902, name: 'Pos5', description: 'welcome to here!!!', skill: [3,1,2], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
        { id: 5, latitude: 47.953865, longitude: 11.643472, name: 'Pos6', description: 'welcome to here!!!', skill: [3,2,4], avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg' },
        { id: 6, latitude: 47.954003, longitude: 11.643387, name: 'Pos7', description: 'welcome to here!!!', skill: [4,1,0], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
        { id: 7, latitude: 47.954150, longitude: 11.643552, name: 'Pos8', description: 'welcome to here!!!', skill: [1,4,2], avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg' },
        { id: 8, latitude: 47.954191, longitude: 11.643357, name: 'Pos9', description: 'welcome to here!!!', skill: [4,1,2], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
        { id: 9, latitude: 47.954144, longitude: 11.643647, name: 'Pos10', description: 'welcome to here!!!', skill: [2,1,3], avatar: 'https://s17.postimg.org/6vpflw1x7/image.jpg' },
        { id: 10, latitude: 47.953781, longitude: 11.643577, name: 'Pos11', description: 'welcome to here!!!', skill: [3,4,2], avatar: 'https://s17.postimg.org/nnar4n263/images3.jpg' },
    ],
    SKILLS: [
        { key: 0, label: I18n.t('HAIR_STYLE'), image: Images.imgSkillIcons[0]},
        { key: 1, label: I18n.t('PEDICURE/MANICURE'), image: Images.imgSkillIcons[1] },
        { key: 2, label: I18n.t('MAKEUP'), image: Images.imgSkillIcons[2] },
        { key: 3, label: I18n.t('PERSONALTRAINER'), image: Images.imgSkillIcons[3] },
        { key: 4, label: I18n.t('YOGA_'), image: Images.imgSkillIcons[4] },
    ],
    PRODUCTS: [
        { key: 0, main: 0, sub: 2, price: 90 },
        { key: 1, main: 1, sub: 1, price: 120 },
        { key: 2, main: 2, sub: 2, price: 70 },
    ],
    CAT_BUTTONS: [
        { key: 0,
            label: I18n.t('HAIR'),
            subCategory: [
                { key: 0, label: I18n.t('HAIR_CUTTING') },
                { key: 1, label: I18n.t('HAIR_COLORING') },
                { key: 2, label: I18n.t('HAIR_WAVING') }
            ]
        },
        { key: 1,
            label: I18n.t('YOGA'),
            subCategory: [
                { key: 0, label: I18n.t('YOGA1') },
                { key: 1, label: I18n.t('YOGA2') },
                { key: 2, label: I18n.t('YOGA3') }
            ]
        },
        { key: 2,
            label: I18n.t('PERSONAL_TRAINER'),
            subCategory: [
                { key: 0, label: I18n.t('PERSONAL1') },
                { key: 1, label: I18n.t('PERSONAL2') },
                { key: 2, label: I18n.t('PERSONAL3') }
            ]
        },
        { key: 3,
            label: I18n.t('NAILS'),
            subCategory: [
                { key: 0, label: I18n.t('NAIL_CUTTING') },
                { key: 1, label: I18n.t('NAIL_COLORING') },
            ]
        },
        { key: 4,
            label: I18n.t('MAKE_UP'),
            subCategory: [
                { key: 0, label: I18n.t('MAKE_UP1') },
                { key: 1, label: I18n.t('MAKE_UP2') },
                { key: 2, label: I18n.t('MAKE_UP3') }]
        },
    ],
};

export default constants;
