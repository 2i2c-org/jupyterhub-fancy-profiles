# When you upgrade this version, update the tag in `.github/workflows/docker-build.yaml`
# as well.
ARG Z2JH_VERSION=4.3.1

# We need node to build the package, but not to run it
# Use the same base image but with nodejs installed as the builder,
# then copy over just the built wheel files for the final image.
# This keeps image size low while also making the whole process
# reasonably simple
FROM quay.io/jupyterhub/k8s-hub:${Z2JH_VERSION} AS builder

USER root

RUN apt update > /dev/null && \
    apt install --yes nodejs npm >/dev/null

ADD . /srv/repo
RUN pip install build
RUN python -m build /srv/repo --outdir /srv/wheels/

FROM quay.io/jupyterhub/k8s-hub:${Z2JH_VERSION}

USER root
COPY --from=builder /srv/wheels/*.whl /srv/wheels/
RUN pip install /srv/wheels/*

# Nested profile_options support: not yet merged upstream (jupyterhub/kubespawner).
# git is needed here for pip's git+ install, it's not part of the base image.
RUN apt update > /dev/null && \
    apt install --yes git >/dev/null && \
    pip install "git+https://github.com/rtmiz/kubespawner.git@nested-profile-options"

USER ${NB_USER}
