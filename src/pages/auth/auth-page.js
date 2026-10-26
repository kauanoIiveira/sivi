import { mountAuthExperience } from '../../generated/public/entry.js';
let servicePromise;
function loadAuth(){ return servicePromise ??= import('../../services/auth-service.js').catch(error=>{servicePromise=undefined;throw error;}); }
export function mountAuthSurface({root}) { return mountAuthExperience(root,{loadAuth}); }
