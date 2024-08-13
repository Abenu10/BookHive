"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dnizoc474',
    api_key: '795331495625983',
    api_secret: 'i2rxrHo8P08K65pfFc3SPcX6Z3E',
});
const uploadToCloudinary = (path, folder) => {
    return cloudinary.uploader
        .upload(path, {
        resource_type: 'auto',
        folder,
    })
        .then((data) => {
        return {
            secure_url: data.secure_url,
            public_id: data.public_id,
            format: data.format,
        };
    })
        .catch((error) => {
        console.error(error);
        throw error;
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const removeFromCloudinary = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.destroy(public_id);
        console.log(`Deleted image from Cloudinary with public ID: ${public_id}`, result);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.removeFromCloudinary = removeFromCloudinary;
