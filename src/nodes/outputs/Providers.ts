import type { BaseNode } from "../BaseNode";

/** @category Node Outputs */
export type ModelProviderNode = BaseNode & OutputsModel;
/** @category Node Outputs */
export interface OutputsModel {
  get MODEL(): number;
}

/** @category Node Outputs */
export type ClipProviderNode = BaseNode & OutputsClip;
/** @category Node Outputs */
export interface OutputsClip {
  get CLIP(): number;
}

/** @category Node Outputs */
export type VaeProviderNode = BaseNode & OutputsVAE;
/** @category Node Outputs */
export interface OutputsVAE {
  get VAE(): number;
}

/** @category Node Outputs */
export type ConditioningProviderNode = BaseNode & OutputsConditioning;
/** @category Node Outputs */
export interface OutputsConditioning {
  get CONDITIONING(): number;
}

/** @category Node Outputs */
export type LatentImageProviderNode = BaseNode & OutputsLatentImage;
/** @category Node Outputs */
export interface OutputsLatentImage {
  get LATENT_IMAGE(): number;
}

/** @category Node Outputs */
export type DecodedImageProviderNode = BaseNode & OutputsImage;
/** @category Node Outputs */
export interface OutputsImage {
  get IMAGE(): number;
}

/** @category Node Outputs */
export type ClipVisionProviderNode = BaseNode & OutputsClipVision;
/** @category Node Outputs */
export interface OutputsClipVision {
  get CLIP_VISION(): number;
}

/** @category Node Outputs */
export type ClipVisionEncodedProviderNode = BaseNode & OutputsClipVisionEncoded;
/** @category Node Outputs */
export interface OutputsClipVisionEncoded {
  get CLIP_VISION_OUTPUT(): number;
}

/** @category Node Outputs */
export type PositiveConditioningProviderNode = BaseNode & OutputsPositiveConditioning;
/** @category Node Outputs */
export interface OutputsPositiveConditioning {
  get POSITIVE_CONDITIONING(): number;
}

/** @category Node Outputs */
export type NegativeConditioningProviderNode = BaseNode & OutputsNegativeConditioning;
/** @category Node Outputs */
export interface OutputsNegativeConditioning {
  get NEGATIVE_CONDITIONING(): number;
}

/** @category Node Outputs */
export type NoiseProviderNode = BaseNode & OutputsNoise;
/** @category Node Outputs */
export interface OutputsNoise {
  get NOISE(): number;
}

/** @category Node Outputs */
export type SamplerProviderNode = BaseNode & OutputsSampler;
/** @category Node Outputs */
export interface OutputsSampler {
  get SAMPLER(): number;
}

/** @category Node Outputs */
export type SigmasProviderNode = BaseNode & OutputsSigmas;
/** @category Node Outputs */
export interface OutputsSigmas {
  get SIGMAS(): number;
}

/** @category Node Outputs */
export type GuiderProviderNode = BaseNode & OutputsGuider;
/** @category Node Outputs */
export interface OutputsGuider {
  get GUIDER(): number;
}

/** @category Node Outputs */
export type VideoProviderNode = BaseNode & OutputsVideo;
/** @category Node Outputs */
export interface OutputsVideo {
  get VIDEO(): number;
}