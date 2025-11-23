import type { BaseNode } from "../BaseNode";

export type ModelProviderNode = BaseNode & HasModel;
export interface HasModel {
  get MODEL(): number;
}

export type ClipProviderNode = BaseNode & HasClip;
export interface HasClip {
  get CLIP(): number;
}

export type VaeProviderNode = BaseNode & HasVAE;
export interface HasVAE {
  get VAE(): number;
}

export type ConditioningProviderNode = BaseNode & HasConditioning;
export interface HasConditioning {
  get CONDITIONING(): number;
}

export type LatentImageProviderNode = BaseNode & HasLatentImage;
export interface HasLatentImage {
  get LATENT_IMAGE(): number;
}

export type DecodedImageProviderNode = BaseNode & HasDecodedImage;
export interface HasDecodedImage {
  get IMAGE(): number;
}